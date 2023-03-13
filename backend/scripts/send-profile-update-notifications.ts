/* eslint-disable no-console */
import admin from 'firebase-admin';
import isEqual from 'lodash.isequal';
import sendMail from './utils';

require('dotenv').config();

// eslint-disable-next-line import/first
import { configureAccount } from '../src/utils/firebase-utils';

const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, true)),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const sendMemberUpdateNotifications = async (): Promise<unknown[]> => {
  const subject = 'IDOL Member Profile Change';
  const text =
    "Hey! You are receiving this email because you're an IDOL admin.\n\nThere are DTI members who have updated their profile and are requesting your approval. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.";
  const adminEmails = await db
    .collection('admins')
    .get()
    .then((docRefs) => docRefs.docs.map((doc) => doc.id));
  return Promise.all(adminEmails.map((email) => sendMail(email, subject, text)));
};

const main = async () => {
  console.log('Reading members and approved-members collections...');
  const latestMembers = await db
    .collection('members')
    .get()
    .then((vals) => vals.docs.map((doc) => doc.data()));

  const approvedMembers = await db
    .collection('approved-members')
    .get()
    .then((vals) => vals.docs.map((doc) => doc.data()));

  if (!isEqual(latestMembers, approvedMembers)) {
    console.log('Profile updates detected. Sending email notifications to IDOL admins...');
    try {
      await sendMemberUpdateNotifications();
    } catch (e) {
      console.error(`Failed to send email notifications: ${e}`);
      process.exit(1);
    }
    console.log('Emails finished sending.');
  } else {
    console.log('No profile updates detected.');
  }
};

main();
