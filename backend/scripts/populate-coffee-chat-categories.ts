/**
 * This is a one-time migration script.
 *
 * Members submit coffee chat categories directly in IDOL now. Run this script only to import a past
 * Google Form export (as a CSV). It is not part of the normal workflow.
 */
/* eslint-disable no-console */
/// <reference types="common-types" />
import admin from 'firebase-admin';
import fs from 'fs';

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

const memberPromise: Promise<IdolMember[]> = db
  .collection('members')
  .get()
  .then((val) => val.docs.map((doc) => doc.data() as IdolMember));

const memberDetails = (mem: IdolMember): MemberDetails => ({
  name: `${mem.firstName} ${mem.lastName}`,
  netid: mem.netid
});

/** Splits a CSV line without breaking commas that sit inside quotes. */
const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
};

const getMembersByCategory = (members: IdolMember[]) => {
  const memberByNetID = new Map(members.map((m) => [m.netid.trim().toLowerCase(), m] as const));
  const csv = fs.readFileSync('./scripts/fa26-coffee-chat-bingo.csv').toString();
  const rows = csv
    .split(/\r?\n/)
    .filter((row) => row.trim() !== '')
    .map(parseCsvLine)
    .slice(1);

  // Google Forms appends new submissions, so the last row for a netid is the current one.
  const latestResponse = new Map<string, string[]>();
  rows.forEach((row) => {
    const netid = row[2]?.trim().toLowerCase();
    if (netid) latestResponse.set(netid, row);
  });

  const membersByCategory = new Map<string, MemberDetails[]>();
  const skippedNetids: string[] = [];

  latestResponse.forEach((row, netid) => {
    const member = memberByNetID.get(netid);
    if (!member) {
      skippedNetids.push(netid);
      return;
    }
    const selected = (row[3] ?? '')
      .split(',')
      .map((category) => category.trim())
      .filter((category) => category !== '');
    selected.forEach((category) => {
      const listed = membersByCategory.get(category) ?? [];
      listed.push(memberDetails(member));
      membersByCategory.set(category, listed);
    });
  });

  return { membersByCategory, skippedNetids };
};

const main = async () => {
  const members = await memberPromise;
  const { membersByCategory, skippedNetids } = getMembersByCategory(members);
  const snapshot = await db.collection('coffee-chat-categories').get();
  let categories = snapshot.docs.map((doc) => doc.data() as CoffeeChatCategory);
  const storedNames = new Set(categories.map((category) => category.name));
  const responseNames = new Set(membersByCategory.keys());
  const missingFromDatabase = [...responseNames].filter((name) => !storedNames.has(name));
  const missingFromResponses = categories.filter((category) => !responseNames.has(category.name));

  // The previous run stored the question text as category 0. Putting that card's real name back here.
  if (missingFromDatabase.length === 1 && missingFromResponses.length === 1) {
    const [restoredName] = missingFromDatabase;
    const broken = missingFromResponses[0];
    categories = categories.map((category) =>
      category.index === broken.index ? { ...category, name: restoredName } : category
    );
    console.log(`Restoring category ${broken.index} to "${restoredName}".`);
  } else if (missingFromDatabase.length > 0 || missingFromResponses.length > 0) {
    throw new Error(
      `Category names do not match the form. In the form only: ${missingFromDatabase.join(
        '; '
      )}. In the database only: ${missingFromResponses.map((category) => category.name).join('; ')}.`
    );
  }

  const batch = db.batch();
  categories.forEach((category) => {
    const updated = { ...category, members: membersByCategory.get(category.name) ?? [] };
    batch.set(db.collection('coffee-chat-categories').doc(String(category.index)), updated);
    console.log(`${updated.index}. ${updated.name}: ${updated.members.length} members`);
  });
  await batch.commit();

  console.log(
    `Updated ${categories.length} categories from ${latestCount(membersByCategory)} form responses.`
  );
  if (skippedNetids.length > 0) {
    console.log(
      `Skipped ${skippedNetids.length} netids with no member: ${skippedNetids.join(', ')}`
    );
  }
};

const latestCount = (membersByCategory: Map<string, MemberDetails[]>): number =>
  new Set([...membersByCategory.values()].flatMap((listed) => listed.map((member) => member.netid)))
    .size;

main().catch(console.error);
