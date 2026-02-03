/* eslint-disable no-console */
/**
 * Script to upload alumni data from CSV to Firestore
 * Usage: npm run upload-alumni
 */
/// <reference types="common-types" />
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import GeocodingService from '../src/utils/geocodingService';
import CityCoordinatesDao from '../src/dao/CityCoordinatesDao';

require('dotenv').config();

// Firebase is already initialized through imports
const db = admin.firestore();
const bucket = admin.storage().bucket();
const cityCoordinatesDao = new CityCoordinatesDao();

/** CSV row type for alumni data input */
interface CSVAlumniRow {
  [key: string]: string | undefined;
  name?: string;
  schoolEmail?: string;
  workEmail?: string;
  dtiRoles?: string;
  subteams?: string;
  gradYear?: string;
  linkedin?: string;
  company?: string;
  jobCategory?: string;
  jobRole?: string;
  city?: string;
  state?: string;
  country?: string;
}

const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of row) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const consolidateLocation = (city?: string, state?: string, country?: string): string | null => {
  if (!city) return null;

  return [city, state, country].filter(Boolean).join(', ');
};

const parseNameToFirstLast = (fullName?: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' };

  const [firstName, ...lastNameParts] = fullName.trim().split(' ');
  return { firstName: firstName || '', lastName: lastNameParts.join(' ') };
};

const standardizeLinkedIn = (linkedinUrl?: string): string | null => {
  if (!linkedinUrl || linkedinUrl === 'N/A' || linkedinUrl.trim() === '') return null;

  const cleaned = linkedinUrl.trim();

  if (cleaned.startsWith('linkedin.com')) {
    return `https://www.${cleaned}`;
  }

  return cleaned;
};

const standardizeDtiRole = (role: string): string => {
  const trimmed = role.trim();

  if (trimmed.toLowerCase().includes('lead')) {
    return 'Lead';
  }

  switch (trimmed) {
    case 'Developer':
    case 'TPM':
      return 'Dev';
    case 'Product Designer':
    case 'Designer':
      return 'Design';
    case 'Product Manager':
      return 'Product';
    case 'Business':
      return 'Business';
    default:
      return trimmed;
  }
};

const extractNetIdFromEmail = (schoolEmail?: string): string | null => {
  if (!schoolEmail || !schoolEmail.includes('@cornell.edu')) return null;
  return schoolEmail.split('@')[0];
};

const uploadAlumniImage = async (netid: string): Promise<string> => {
  const imagePath = path.join(__dirname, 'alumni-images', `${netid}.jpg`);

  if (!fs.existsSync(imagePath)) {
    console.log(`No image found for netid: ${netid}`);
    return '';
  }

  try {
    const fileName = `alumImages/${netid}.jpg`;
    const file = bucket.file(fileName);

    await file.save(fs.readFileSync(imagePath), {
      metadata: {
        contentType: 'image/jpeg'
      }
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Return the public URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error(`Failed to upload image for ${netid}:`, error);
    return '';
  }
};

const validateAlumni = async (alumniRow: CSVAlumniRow): Promise<Alumni> => {
  const { firstName, lastName } = parseNameToFirstLast(alumniRow.name);
  const email =
    alumniRow.workEmail && alumniRow.workEmail !== 'N/A'
      ? alumniRow.workEmail
      : alumniRow.schoolEmail || '';
  const location = consolidateLocation(alumniRow.city, alumniRow.state, alumniRow.country);
  const subteams = alumniRow.subteams
    ? [
        ...new Set(
          alumniRow.subteams
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s)
        )
      ]
    : [];
  const dtiRoles = alumniRow.dtiRoles
    ? [
        ...new Set(
          alumniRow.dtiRoles
            .split(',')
            .map((s) => standardizeDtiRole(s.trim()))
            .filter((s) => s)
        )
      ]
    : [];
  const jobCategory = alumniRow.jobCategory || 'Other';
  const jobRole = alumniRow.jobRole || 'Other';

  const parsedGradYear = parseInt(alumniRow.gradYear || '', 10);
  const gradYear = isNaN(parsedGradYear) ? null : parsedGradYear;

  // Handle image upload
  const netid = extractNetIdFromEmail(alumniRow.schoolEmail);
  const imageUrl = netid ? await uploadAlumniImage(netid) : '';

  // Handle geocoding
  if (location) {
    try {
      const geocodingResult = await GeocodingService.geocodeAndStore(location);

      // Add alumni to the city coordinates
      const alumniUuid = netid || uuidv4();
      await cityCoordinatesDao.addAlumniToLocation(
        geocodingResult.latitude,
        geocodingResult.longitude,
        alumniUuid,
        geocodingResult.locationName
      );

      console.log(`Geocoded location for ${firstName} ${lastName}: ${location}`);
    } catch (error) {
      console.warn(`Failed to geocode location "${location}" for ${firstName} ${lastName}:`, error);
    }
  }

  return {
    uuid: netid || uuidv4(),
    firstName,
    lastName,
    gradYear,
    email,
    subteams: subteams || null,
    dtiRoles,
    linkedin: standardizeLinkedIn(alumniRow.linkedin),
    location,
    company: alumniRow.company || null,
    jobCategory,
    jobRole,
    about: null,
    imageUrl
  } as Alumni;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  try {
    console.log('Processing alumni data');
    const csv = fs.readFileSync('./scripts/alumni-data.csv').toString();
    const rows = csv.split(/\r?\n/).filter((row) => row.trim());

    const headers = parseCSVRow(rows[0]);
    const alumniData: Alumni[] = [];
    const failedRows: string[] = [];

    const dataRows = rows.slice(1);
    console.log(`Processing ${dataRows.length} alumni records sequentially\n`);

    for (let index = 0; index < dataRows.length; index++) {
      const row = dataRows[index];
      try {
        const values = parseCSVRow(row);
        const alumniRow: CSVAlumniRow = {};
        headers.forEach((header, i) => {
          alumniRow[header] = values[i];
        });

        const alumni = await validateAlumni(alumniRow);
        alumniData.push(alumni);

        if ((index + 1) % 10 === 0) {
          console.log(`Processed ${index + 1}/${dataRows.length} alumni`);
        }

        // Add delay between requests to respect Nominatim's rate limit (1 req/sec)
        const location = consolidateLocation(alumniRow.city, alumniRow.state, alumniRow.country);
        if (location) {
          await delay(1100); 
        }
      } catch (validationError: unknown) {
        const rowNumber = index + 2;
        const errorMessage = (validationError as Error).message;
        console.error(`Row ${rowNumber} failed: ${errorMessage}`);
        failedRows.push(rowNumber.toString());
      }
    }

    if (failedRows.length > 0) {
      console.log(`\nFailed rows: ${failedRows.join(', ')}`);
    }

    console.log(`\nUploading ${alumniData.length} alumni records to Firestore`);

    const batch = db.batch();
    alumniData.forEach((alumni) => {
      batch.set(db.collection('alumni').doc(alumni.uuid), alumni);
    });

    await batch.commit();
    console.log(`Success: Uploaded ${alumniData.length} alumni records to Firestore`);
  } catch (error) {
    console.error('Upload failed:', error);
    process.exit(1);
  }
};

main();
