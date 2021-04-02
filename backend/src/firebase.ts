import admin from 'firebase-admin';
import { DBTeam } from './DataTypes';

require('dotenv').config();

const serviceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');

const configureAccount = (sa) => {
  const configAcc = sa;
  let parsedPK;
  try {
    parsedPK = JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string);
  } catch (err) {
    parsedPK = process.env.FIREBASE_PRIVATE_KEY;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID;
  return configAcc;
};

export const app = admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAccount)),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: 'gs://idol-b6c68.appspot.com'
});

export const bucket = admin.storage().bucket();
export const db = admin.firestore();

export const memberCollection: admin.firestore.CollectionReference<IdolMember> = db
  .collection('members')
  .withConverter({
    fromFirestore(snapshot): IdolMember {
      return snapshot.data() as IdolMember;
    },
    toFirestore(userData: IdolMember) {
      return userData;
    }
  });

export const teamCollection: admin.firestore.CollectionReference<DBTeam> = db
  .collection('teams')
  .withConverter({
    fromFirestore(snapshot): DBTeam {
      return snapshot.data() as DBTeam;
    },
    toFirestore(userData: DBTeam) {
      return userData;
    }
  });

export const adminCollection: admin.firestore.CollectionReference = db.collection(
  'admins'
);
