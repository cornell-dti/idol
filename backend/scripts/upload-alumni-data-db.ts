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
  firstName?: string;
  lastName?: string;
  gradYear?: string;
  email?: string;
  subteams?: string;
  dtiRole?: string;
  imageUrl?: string;
  linkedin?: string;
  location?: string;
  company?: string;
  jobRole?: string;
  specification?: string;
  about?: string;
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

const validateAlumni = (alumniRow: CSVAlumniRow): DBAlumni => {
  const gradYear = parseInt(alumniRow.gradYear || '', 10);
  if (isNaN(gradYear)) {
    throw new Error('gradYear must be a valid number');
  }

  const subteams = alumniRow.subteams ? alumniRow.subteams.split(',').map((s) => s.trim()) : [];
  return {
    uuid: uuidv4(),
    firstName: alumniRow.firstName || '',
    lastName: alumniRow.lastName || '',
    gradYear,
    email: alumniRow.email || '',
    subteams,
    dtiRole: alumniRow.dtiRole || '',
    linkedin: alumniRow.linkedin || null,
    location: alumniRow.location || null,
    locationId: null,
    company: alumniRow.company || null,
    jobRole: alumniRow.jobRole || 'Other',
    specification: alumniRow.specification || null,
    about: alumniRow.about || null,
    imageUrl: alumniRow.imageUrl || '',
    timestamp: Date.now()
  };
};

const main = async () => {
  try {
    console.log('Processing alumni data');
    const csv = fs.readFileSync('./scripts/alumni-data.csv').toString();
    const rows = csv.split(/\r?\n/).filter((row) => row.trim());

    const headers = parseCSVRow(rows[0]);
    const alumniData = rows.slice(1).map((row, index) => {
      const values = parseCSVRow(row);
      const alumniRow: CSVAlumniRow = {};
      headers.forEach((header, i) => {
        alumniRow[header] = values[i];
      });
      try {
        return validateAlumni(alumniRow);
      } catch (validationError: unknown) {
        throw new Error(`Row ${index + 2}: ${(validationError as Error).message}`);
      }
    });

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
