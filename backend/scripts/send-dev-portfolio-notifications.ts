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
    // current date: 12PM the day before the deadline (created in EST)
    const currentDate = new Date();
    // compute 11:59:59.999 the day after (end of day of the deadline)
    const deadline = new Date(currentDate);
    deadline.setDate(currentDate.getDate() + 1);
    deadline.setHours(23, 59, 59, 999);
    // compute start of that same day (Sunday 00:00:00.000)
    const startOfDeadlineDay = new Date(deadline);
    startOfDeadlineDay.setHours(0, 0, 0, 0);

    // query Firestore for dev portfolios due on that day
    console.log('querying for dev portfolios due tomorrow...');
    const devPortfolioSnapshot = await db.collection('dev-portfolio')
        .where('deadline', '>=', startOfDeadlineDay.getTime())
        .where('deadline', '<=', deadline.getTime())
        .get();

    if (devPortfolioSnapshot.empty) {
        console.error('Error: No dev portfolios found due tomorrow');
        process.exit(1);
    } else if (devPortfolioSnapshot.size != 1){
        console.error('Error: Multiple dev portfolios found due tomorrow');
        process.exit(1);
    } else {
        console.log('One dev portfolio found due tomorrow, success!')
    }

    const devPortfolioDoc = devPortfolioSnapshot.docs[0]; // first (and only) document
    const devPortfolioData = devPortfolioDoc.data();
    const submissions = devPortfolioData.submissions; // the submissions array
    const devPortfolioName = devPortfolioData.name;

    const devsSubmitted = await Promise.all( 
        submissions.map(async submission => {
            let memberRef = submission.member;
            const memberDoc = await memberRef.get();
            if (memberDoc.exists) {
                const memberData = memberDoc.data();
                return memberData.email;
            } else {
                console.log("Member document does not exist");
            }
        })
    );

    const EMAIL_SUBJECT = '[ACTION REQUIRED] Dev Portfolio Submission';
    const EMAIL_BODY = `If you are not taking DTI for credit this semester, please ignore.\n\nThis is a reminder to submit your portfolio for ${devPortfolioName} which is due by ${deadline.toLocaleString()}. You must contact leads if you require an extension.`;

    const allDevsEmails = ( await db.collection('members')
        .where('role', 'in', ['developer', 'tpm'])
        .get() 
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(devs => devs.map(dev => dev.email))
    );

    const devsNotSubmitted = allDevsEmails.filter(email => !devsSubmitted.includes(email));
    console.log("Devs submitted count: " + [...new Set(devsSubmitted)].length)
    console.log("Devs not submitted count: " + [...new Set(devsNotSubmitted)].length);
    console.log("All devs count: " + allDevsEmails.length);
    console.log(`${devsNotSubmitted.length} devs not submitted a portfolio this week, sending email notification...`);
    try {
      await Promise.all(
        devsNotSubmitted.map((email) => sendMail(email, EMAIL_SUBJECT, EMAIL_BODY))
      );
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    console.log('Email notification successfully sent :)');
};

main();