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
  .collection('approved-members')
  .get()
  .then((val) => val.docs.map((doc) => doc.data() as IdolMember));

const memberDetails = (mem: IdolMember): MemberDetails => ({
  name: `${mem.firstName} ${mem.lastName}`,
  netid: mem.netid
});

const filteredSuggestions = (
  members: IdolMember[],
  predicate: (m: IdolMember) => boolean
): MemberDetails[] => members.filter(predicate).map((mem) => memberDetails(mem));

const getMembersByCategory = async (members: IdolMember[]) => {
  const memberByNetID = new Map(members.map((m) => [m.netid.trim().toLowerCase(), m] as const));

  const csv = fs.readFileSync('./scripts/sp26-coffee-chat-bingo.csv').toString();
  const rows = csv.split(/\r?\n/);

  let responses = rows.splice(1);

  const seenNetIds = new Set<string>();
  responses = responses
    .reverse()
    .filter((response) => {
      const netid = response.split(',')[2]?.trim().toLowerCase();
      if (!netid || seenNetIds.has(netid)) {
        return false;
      }
      seenNetIds.add(netid);
      return true;
    })
    .reverse();

  const board = rows[0]
    .split(',')
    .slice(3)
    .map((c) => c.trim());
  const suggestions: CoffeeChatSuggestions = {};

  const OFFSET = 3;
  board.forEach((category, index) => {
    suggestions[category] = responses
      .filter((response) => {
        const cells = response.split(',');
        return cells[OFFSET + index]?.trim().toLowerCase() === 'yes';
      })
      .map((response) => {
        const netid = response.split(',')[2]?.trim().toLowerCase();
        return netid ? memberByNetID.get(netid) : undefined;
      })
      .filter((m): m is IdolMember => m !== undefined)
      .map((m) => memberDetails(m));
  });

  suggestions['a newbie'] = filteredSuggestions(
    members,
    (mem) => mem.semesterJoined === 'Spring 2026'
  );

  const alumniSnapshot = await db.collection('alumni').where('gradYear', '==', 2025).get();
  const alumniMembers: MemberDetails[] = alumniSnapshot.docs.map((doc) => {
    const alum = doc.data() as Alumni;
    return { name: `${alum.firstName} ${alum.lastName}`, netid: alum.uuid };
  });
  const existingAlumNetIds = new Set(
    (suggestions['a DTI alum'] ?? []).map((m) => m.netid.trim().toLowerCase())
  );
  suggestions['a DTI alum'] = [
    ...(suggestions['a DTI alum'] ?? []),
    ...alumniMembers.filter((m) => !existingAlumNetIds.has(m.netid.trim().toLowerCase()))
  ];

  return board.map(
    (name, index): CoffeeChatCategory => ({ name, members: suggestions[name], index })
  );
};

const main = async () => {
  const members = await memberPromise;
  const categories = await getMembersByCategory(members);

  /* commented out for now - no need to filter self from categories
  const filterSelfFromCategories = (mem: IdolMember) =>
    Object.fromEntries(
      Object.entries(categories).map(([key, value]) => [
        key,
        (value as MemberDetails[]).filter((details) => details.netid !== mem.netid)
      ])
    );
  */

  const batch = db.batch();
  for (const category of categories) {
    batch.set(db.collection('coffee-chat-categories').doc(String(category.index)), category);
  }
  await batch.commit();

  console.log(`Successfully uploaded ${categories.length} categories to coffee-chat-categories.`);
};

main().catch(console.error);
