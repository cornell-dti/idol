/* eslint-disable no-console */
/// <reference types="common-types" />
import admin from 'firebase-admin';

import { configureAccount } from '../src/utils/firebase-utils';
import DEFAULT_REIMBURSEMENT_TEAMS from '../src/consts/reimbursementTeams';
import serviceAcc from '../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json';

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'dev')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const seedTeam = async (team: ReimbursementTeam): Promise<void> => {
  const ref = db.collection('reimbursement-teams').doc(team.teamId);
  const existing = await ref.get();
  if (existing.exists) {
    console.log(`Skipping ${team.teamId}: already exists.`);
    return;
  }
  await ref.set(team);
  console.log(`Created reimbursement team ${team.teamId} (budget $${team.budget}).`);
};

const main = async () => {
  await Promise.all(DEFAULT_REIMBURSEMENT_TEAMS.map(seedTeam));
};

main().catch(console.error);
