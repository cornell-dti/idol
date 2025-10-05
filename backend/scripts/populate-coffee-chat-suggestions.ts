/* eslint-disable no-console */
/// <reference types="common-types" />
import admin from 'firebase-admin';
import fs from 'fs';
import COFFEE_CHAT_BINGO_BOARD from '../src/consts';

require('dotenv').config();

import { configureAccount } from '../src/utils/firebase-utils';

//const serviceAcc = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');
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

const getMembersByCategory = async () => {
  const csv = fs.readFileSync('./scripts/fa25-coffee-chat-bingo.csv').toString();
  const rows = csv.split('\n');

  const responses = rows.splice(1);

  const board = COFFEE_CHAT_BINGO_BOARD.flat();
  const suggestions: CoffeeChatSuggestions = {};

  const members = await memberPromise;

  const OFFSET = 3;
  board.forEach((category, index) => {
    suggestions[category] = responses
      .filter((response) => {
        const cells = response.split(',');
        return cells[OFFSET + index].toLowerCase() === 'yes';
      })
      .map((response) => response.split(',')[1].split(' '))
      .filter(([first, last]) =>
        members.some((member) => member.firstName === first && member.lastName === last)
      )
      .map((name) => ({
        name: name.join(' '),
        netid:
          members.find((member) => member.firstName === name[0] && member.lastName === name[1])
            ?.netid ?? ''
      }));
  });

  suggestions['a newbie'] = filteredSuggestions(
    members,
    (mem) => mem.semesterJoined === 'Fall 2025'
  );

  return suggestions;
};

const main = async () => {
  const membersByCategory = await getMembersByCategory();

  const members = await memberPromise;

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
