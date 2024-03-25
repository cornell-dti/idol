
import * as firebase from 'firebase-admin';
import admin from 'firebase-admin';
import { coffeeChatsCollection } from '../src/firebase';

//slint-disable-next-line import/first
import { configureAccount } from '../src/utils/firebase-utils';
require('dotenv').config();

const serviceAcc = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAcc, 'prod')),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://cornelldti-idol.appspot.com'
});

// const db = admin.firestore();

const main = async () => {
  // await db.collection('coffee-chats');
  const snapshot = await coffeeChatsCollection.get();
  return snapshot.docs.map((doc) => doc.id);
};

main();


