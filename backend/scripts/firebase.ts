require('dotenv').config();

import admin = require('./../node_modules/firebase-admin/lib');

const serviceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

const configureAccount = (sa) => {
  const configAcc = sa;
  let parsedPK;
  try {
    parsedPK = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);
  } catch (err) {
    parsedPK = process.env.FIREBASE_PRIVATE_KEY;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID;
  return configAcc;
};

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAccount)),
  databaseURL: 'https://idol-b6c68.firebaseio.com'
});

export const db = admin.firestore();
