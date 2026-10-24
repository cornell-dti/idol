/* eslint-disable no-console */
/// <reference types="common-types" />
import admin from 'firebase-admin';

import { configureAccount } from '../src/utils/firebase-utils';
import serviceAcc from '../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json';

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'dev')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const TEAM_BUDGET = 300;

const LEAD_TEAMS: ReimbursementTeam[] = [
  {
    teamId: 'biz-leads',
    displayName: 'Business Leads',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'pm-leads',
    displayName: 'PM Leads',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'ops-leads',
    displayName: 'Ops Leads',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'design-leads',
    displayName: 'Design Leads',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'dev-leads',
    displayName: 'Dev Leads',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  }
];

const PRODUCT_TEAMS: ReimbursementTeam[] = [
  {
    teamId: 'loop',
    displayName: 'Loop',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'cuapts',
    displayName: 'CU Apts',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'curaise',
    displayName: 'CU Raise',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'courseplan',
    displayName: 'CoursePlan',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  },
  {
    teamId: 'idol',
    displayName: 'IDOL',
    budget: TEAM_BUDGET,
    totalSpent: 0,
    assignedAdmins: []
  }
];

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
  await Promise.all([...LEAD_TEAMS, ...PRODUCT_TEAMS].map(seedTeam));
};

main().catch(console.error);
