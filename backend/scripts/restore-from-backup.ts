import admin from 'firebase-admin';
import { configureAccount, readDbData, rewriteDbData } from '../src/utils/firebase-utils';

require('dotenv').config();

const prodServiceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');
const backupServiceAccount = require('../resources/cornelldti-idol-backup-9d909d7b0efc.json');

const main = async () => {
  const prodApp = admin.initializeApp(
    {
      credential: admin.credential.cert(configureAccount(prodServiceAccount, 'prod')),
      databaseURL: 'https://idol-b6c68.firebaseio.com',
      storageBucket: 'gs://cornelldti-idol.appspot.com'
    },
    'prod'
  );
  const backupApp = admin.initializeApp(
    {
      credential: admin.credential.cert(configureAccount(backupServiceAccount, 'backup')),
      databaseURL: 'https://idol-b6c68.firebaseio.com',
      storageBucket: 'gs://cornelldti-idol.appspot.com'
    },
    'backup'
  );
  const backupDb = backupApp.firestore();
  const prodDb = admin.firestore(prodApp);

  const backupData = await readDbData(backupDb);
  return rewriteDbData(prodDb, backupData);
};

main();
