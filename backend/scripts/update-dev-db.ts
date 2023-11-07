import admin from 'firebase-admin';
import { configureAccount, readDbData, rewriteDbData } from '../src/utils/firebase-utils';

require('dotenv').config();

const prodServiceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');
const devServiceAccount = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');

const main = async () => {
  const prodApp = admin.initializeApp(
    {
      credential: admin.credential.cert(configureAccount(prodServiceAccount, 'prod')),
      databaseURL: 'https://idol-b6c68.firebaseio.com',
      storageBucket: 'gs://cornelldti-idol.appspot.com'
    },
    'prod'
  );
  const devApp = admin.initializeApp(
    {
      credential: admin.credential.cert(configureAccount(devServiceAccount, 'dev')),
      databaseURL: 'https://idol-b6c68.firebaseio.com',
      storageBucket: 'gs://cornelldti-idol.appspot.com'
    },
    'dev'
  );
  const devDb = devApp.firestore();
  const prodDb = admin.firestore(prodApp);

  const prodData = await readDbData(prodDb);
  return rewriteDbData(devDb, prodData);
};

main();
