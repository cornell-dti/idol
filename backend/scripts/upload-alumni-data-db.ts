/* eslint-disable no-console */
/**
 * Script to upload alumni data from CSV to Firestore
 * Usage: npm run upload-alumni
 */
import admin from 'firebase-admin';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { DBAlumni } from '../src/types/DataTypes';

import { configureAccount } from '../src/utils/firebase-utils';

require('dotenv').config();

const serviceAcc = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');
// const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'dev')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

/** CSV row type for alumni data input */
interface CSVAlumniRow {
  [key: string]: string | undefined;
  name?: string;
  schoolEmail?: string;
  workEmail?: string;
  dtiRoles?: string;
  subteams?: string;
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

const validateAlumni = (alumniRow: CSVAlumniRow): DBAlumni => {
  const { firstName, lastName } = parseNameToFirstLast(alumniRow.name);
  const email =
    alumniRow.workEmail && alumniRow.workEmail !== 'N/A'
      ? alumniRow.workEmail
      : alumniRow.schoolEmail || '';
  const location = consolidateLocation(alumniRow.city, alumniRow.state, alumniRow.country);
  const subteams = alumniRow.subteams ? alumniRow.subteams.split(',').map((s) => s.trim()) : [];
  const dtiRoles = alumniRow.dtiRoles ? alumniRow.dtiRoles.split(',').map((s) => s.trim()) : [];
  const jobCategory = alumniRow.jobCategory || 'Other';
  const jobRole = alumniRow.jobRole || 'Other';

  return {
    uuid: uuidv4(),
    firstName,
    lastName,
    gradYear: null,
    email,
    subteams: subteams || null,
    dtiRoles,
    linkedin: standardizeLinkedIn(alumniRow.linkedin),
    location,
    locationId: null,
    company: alumniRow.company || null,
    jobCategory,
    jobRole,
    about: null,
    imageUrl: ''
  } as DBAlumni;
};

const main = async () => {
  try {
    console.log('Processing alumni data');
    const csv = fs.readFileSync('./scripts/alumni-data.csv').toString();
    const rows = csv.split(/\r?\n/).filter((row) => row.trim());

    const headers = parseCSVRow(rows[0]);
    const alumniData: DBAlumni[] = [];
    const failedRows: string[] = [];

    rows.slice(1).forEach((row, index) => {
      try {
        const values = parseCSVRow(row);
        const alumniRow: CSVAlumniRow = {};
        headers.forEach((header, i) => {
          alumniRow[header] = values[i];
        });

        const alumni = validateAlumni(alumniRow);
        alumniData.push(alumni);
      } catch (validationError: unknown) {
        const rowNumber = index + 2;
        const errorMessage = (validationError as Error).message;
        console.error(`Row ${rowNumber} failed: ${errorMessage}`);
        failedRows.push(rowNumber.toString());
      }
    });

    if (failedRows.length > 0) {
      console.log(`\nFailed rows: ${failedRows.join(', ')}`);
    }

    console.log(`Uploading ${alumniData.length} alumni records to Firestore`);

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
