/* eslint-disable no-console */
import admin from 'firebase-admin';
import { configureAccount } from '../src/utils/firebase-utils';
import { DBShoutout } from '../src/types/DataTypes';
import { getMemberFromDocumentReference } from '../src/utils/memberUtil';

require('dotenv').config();

const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'prod')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();
const QUERY_DATE = '2025-01-01';

const main = async () => {
  console.log(`Collecting all shoutouts from ${QUERY_DATE} until now...`);
  const queryDateUnix = Math.floor(new Date(QUERY_DATE).getTime());

  const shoutoutDocs = (
    await db.collection('shoutouts').where('timestamp', '>=', queryDateUnix).get()
  ).docs;

  const memberToNumberOfShoutouts: { [key: string]: number } = {};
  await Promise.all(
    shoutoutDocs.map(async (shoutoutDoc) => {
      const shoutout = shoutoutDoc.data() as DBShoutout;
      const member = await getMemberFromDocumentReference(shoutout.giver);
      const memberStr = `${member.firstName} ${member.lastName} (${member.netid})`;

      if (memberToNumberOfShoutouts[memberStr] === undefined) {
        memberToNumberOfShoutouts[memberStr] = 1;
      } else {
        memberToNumberOfShoutouts[memberStr] += 1;
      }
    })
  );

  const rankedMembers: [string, number][] = [];

  // eslint-disable-next-line guard-for-in
  for (const memberStr in memberToNumberOfShoutouts) {
    rankedMembers.push([memberStr, memberToNumberOfShoutouts[memberStr]]);
  }
  rankedMembers.sort((a, b) => b[1] - a[1]);

  console.log(rankedMembers);
};

main();
