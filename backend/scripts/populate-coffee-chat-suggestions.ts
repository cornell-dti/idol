/* eslint-disable no-console */
/// <reference types="common-types" />
import admin from 'firebase-admin';
import fs from 'fs';
import COFFEE_CHAT_BINGO_BOARD from '../src/consts';

import { configureAccount } from '../src/utils/firebase-utils';

require('dotenv').config();

// Helper function to capitalize first letter of each word
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// const serviceAcc = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');
const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'prod')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const memberPromise: Promise<IdolMember[]> = db
  .collection('approved-members')
  .get()
  .then((val) => val.docs.map((doc) => doc.data() as IdolMember));

const filteredSuggestions = (
  members: IdolMember[],
  predicate: (m: IdolMember) => boolean
): MemberDetails[] =>
  members
    .filter(predicate)
    .map((mem) => ({ name: `${mem.firstName} ${mem.lastName}`, netid: mem.netid }));

const getMembersByCategory = async (members: IdolMember[]) => {
  // Update csv path to current semester suggestions
  const csv = fs.readFileSync('./scripts/fa25-coffee-chat-bingo.csv').toString();
  const rows = csv.split(/\r?\n/);

  let responses = rows.splice(1);

  // Remove duplicates by NetID and keep latest submission
  const seenNetIds = new Set<string>();
  responses = responses
    .reverse()
    .filter((response) => {
      const netid = response.split(',')[2]?.toLowerCase();
      if (!netid || seenNetIds.has(netid)) {
        return false;
      }
      seenNetIds.add(netid);
      return true;
    })
    .reverse();

  // Note: This script handles basic name capitalization and duplicate removal,
  // but manual CSV review may still be needed for unaccountable name formatting issues

  const board = COFFEE_CHAT_BINGO_BOARD.flat();
  const suggestions: CoffeeChatSuggestions = {};

  const OFFSET = 3;
  board.forEach((category, index) => {
    suggestions[category] = responses
      .filter((response) => {
        const cells = response.split(',');
        return cells[OFFSET + index].toLowerCase() === 'yes';
      })
      .map((response) => {
        const nameParts = response.split(',')[1].split(' ');
        const first = capitalizeFirst(nameParts[0]);
        const last = nameParts
          .slice(1)
          .map((part) => capitalizeFirst(part))
          .join(' ');
        return [first, last];
      })
      .filter(([first, last]) =>
        members.some((member) => member.firstName === first && member.lastName === last)
      )
      .map(([first, last]) => ({
        name: `${first} ${last}`,
        netid:
          members.find((member) => member.firstName === first && member.lastName === last)?.netid ??
          ''
      }));
  });

  suggestions['a newbie'] = filteredSuggestions(
    members,
    (mem) => mem.semesterJoined === 'Fall 2025'
  );

  return suggestions;
};

const main = async () => {
  const members = await memberPromise;
  const membersByCategory = await getMembersByCategory(members);

  const filterSelfFromCategories = (mem: IdolMember) =>
    Object.fromEntries(
      Object.entries(membersByCategory).map(([key, value]) => [
        key,
        (value as MemberDetails[]).filter((details) => details.netid !== mem.netid)
      ])
    );

  const ids = await db
    .collection('coffee-chat-suggestions')
    .get()
    .then((val) => val.docs.map((doc) => doc.id));

  await Promise.all(ids.map((id) => db.collection('coffee-chat-suggestions').doc(id).delete()));

  await Promise.all(
    members.map((mem) =>
      db.collection('coffee-chat-suggestions').doc(mem.email).create(filterSelfFromCategories(mem))
    )
  );
};

main();
