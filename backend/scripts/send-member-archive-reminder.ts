/* eslint-disable no-console */
import admin from 'firebase-admin';
import sendMail from './utils';
import { configureAccount } from '../src/utils/firebase-utils';

const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'prod')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const EMAIL_SUBJECT = '[ACTION REQUIRED] Members Archive';
const EMAIL_BODY =
  'Hey there from the IDOL team!\n\nThis is a reminder to upload the CSV results from the returning members survey to archive members before this upcoming semester.\n\nThank you!';

const main = async () => {
  const opsLeadsEmails = (await db.collection('ops-leads').get()).docs.map((doc) => doc.id);
  opsLeadsEmails.map((email) => console.log(email));
  console.log('Sending email notification...');
  try {
    await Promise.all(opsLeadsEmails.map((email) => sendMail(email, EMAIL_SUBJECT, EMAIL_BODY)));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log('Email notification successfully sent :)');
};

main();
