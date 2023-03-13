/* eslint-disable no-console */
import admin from 'firebase-admin';
import sendMail from './utils';
import { configureAccount } from '../src/utils/firebase-utils';

const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, true)),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const EMAIL_ADDRESS = 'hello@cornelldti.org';
const EMAIL_SUBJECT = '[ACTION REQUIRED] Pending TEC Requests';
const EMAIL_BODY =
  'Hey there from the IDOL team!\n\nThere are DTI members who have submitted TEC requests that are currently pending. Please visit https://idol.cornelldti.org/admin/team-events to review the requests.\n\n Thank you!';

const main = async () => {
  console.log('Reading all team event credit requests...');
  const numPendingRequests = (
    await db.collection('team-event-attendance').where('pending', '==', 'true').count().get()
  ).data().count;

  if (numPendingRequests === 0) {
    console.log('No pending requests.');
  } else {
    console.log('Pending requests detected, sending email notification...');
    try {
      await sendMail(EMAIL_ADDRESS, EMAIL_SUBJECT, EMAIL_BODY);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    console.log('Email notification successfully sent :)');
  }
};

main();
