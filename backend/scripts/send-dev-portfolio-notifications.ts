/* eslint-disable no-console */
import admin from 'firebase-admin';
import sendMail from './utils';
import { configureAccount } from '../src/utils/firebase-utils';

require('dotenv').config();

const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'prod')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

const db = admin.firestore();

const main = async () => {
  // current date: 12:00:00 EST the day before the deadline (17:00:00 UTC)
  const currentDate = new Date();
  // compute 23:59:59.999 EST the day after, i.e. 4:59:59.999 UTC two days after (end of day of the deadline)
  const deadline = new Date(currentDate);
  deadline.setDate(currentDate.getDate() + 2);
  deadline.setHours(4, 59, 59, 999);

  // query Firestore for dev portfolios due on that day
  console.log('querying for dev portfolios due tomorrow...');
  const devPortfolioSnapshot = await db
    .collection('dev-portfolio')
    .where('deadline', '>=', currentDate.getTime())
    .where('deadline', '<=', deadline.getTime())
    .get();

  if (devPortfolioSnapshot.empty) {
    console.log('No dev portfolios found due tomorrow, exiting...');
    process.exit(0);
  } else if (devPortfolioSnapshot.size !== 1) {
    console.error('Error: Multiple dev portfolios found due tomorrow');
    process.exit(1);
  } else {
    console.log('One dev portfolio found due tomorrow, success!');
  }

  const devPortfolioDoc = devPortfolioSnapshot.docs[0]; // first (and only) document
  const devPortfolioData = devPortfolioDoc.data();
  const { submissions } = devPortfolioData; // the submissions array
  const devPortfolioName = devPortfolioData.name;
  if (devPortfolioData.name.toLowerCase().includes('extensions')) {
    console.log('Notifications not required for dev portfolio extensions, exiting...');
    process.exit(0);
  }

  const devsSubmitted = (
    await Promise.all(
      submissions.map(async (submission) => {
        const memberRef = submission.member;
        const memberDoc = await memberRef.get();

        if (!memberDoc.exists) {
          console.log('Member document does not exist');
          return null;
        }

        const memberData = memberDoc.data();
        return memberData.email;
      })
    )
  ).filter((email): email is string => email !== null);

  const EMAIL_SUBJECT = '[ACTION REQUIRED] Dev Portfolio Submission';
  const deadlineString = devPortfolioData.deadline.toLocaleString('en-US', {
    timeZone: 'America/New_York'
  });
  const EMAIL_BODY = `If you are not taking DTI for credit this semester, please ignore.\n\nThis is a reminder to submit your portfolio for ${devPortfolioName} which is due by ${deadlineString}. You must contact leads if you require an extension.`;

  const allDevsEmails = await db
    .collection('members')
    .where('role', 'in', ['developer', 'tpm'])
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
    .then((devs) => devs.map((dev) => dev.email));

  const devsNotSubmitted = allDevsEmails.filter((email) => !devsSubmitted.includes(email));
  console.log(`Devs submitted count: ${[...new Set(devsSubmitted)].length}`);
  console.log(`Devs not submitted count: ${[...new Set(devsNotSubmitted)].length}`);
  console.log(`All devs count: ${allDevsEmails.length}`);
  console.log(
    `${devsNotSubmitted.length} devs not submitted a portfolio this week, sending email notification...`
  );
  try {
    await Promise.all(devsNotSubmitted.map((email) => sendMail(email, EMAIL_SUBJECT, EMAIL_BODY)));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log('Email notification successfully sent :)');
};

main();
