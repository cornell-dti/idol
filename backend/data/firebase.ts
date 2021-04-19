require('dotenv').config({path:'/backend/data/.env'})

import admin = require('firebase-admin');

const serviceAccount = require('backend/resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');
console.log("here");
const configureAccount = (sa) => {
  const configAcc = sa;
  let parsedPK;
  try {
    console.log(process.env.FIREBASE_DEV_PRIVATE_KEY);
    parsedPK = JSON.parse(process.env.FIREBASE_DEV_PRIVATE_KEY as string);
    console.log("here");
  } catch (err) {
    console.log(err);
    parsedPK = process.env.FIREBASE_DEV_PRIVATE_KEY as string;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id = process.env.FIREBASE_DEV_PRIVATE_KEY_ID;
  return configAcc;
};

admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAccount)),
  databaseURL: 'https://idol-b6c68.firebaseio.com'
});

export const db = admin.firestore();