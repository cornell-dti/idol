import admin from 'firebase-admin';
import { configureAccount, deleteCollection } from '../src/utils/firebase-utils';

require('dotenv').config();

const prodServiceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');
const devServiceAccount = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');

type DbData = {
  id: string;
  docs: {
    id: string;
    data: unknown;
  }[];
}[];

const readDbData = async (prodDb: FirebaseFirestore.Firestore): Promise<DbData> => {
  const allCollections = await prodDb.listCollections();
  return Promise.all(
    allCollections.map(async (collection) => {
      const docRefs = (await collection.get()).docs;
      const docs = docRefs.map((docRef) => ({ id: docRef.id, data: docRef.data() }));
      return {
        id: collection.id,
        docs
      };
    })
  );
};

const rewriteDbData = async (devDb: FirebaseFirestore.Firestore, data: DbData): Promise<void[]> => {
  const allCollections = await devDb
    .listCollections()
    .then((collections) => collections.map((collection) => collection.id));

  await Promise.all(allCollections.map((collection) => deleteCollection(devDb, collection, 10)));
  return Promise.all(
    data.map(async (collection) => {
      await Promise.all(
        collection.docs.map(async (doc) => {
          await devDb.doc(`${collection.id}/${doc.id}`).set(doc.data);
        })
      );
    })
  );
};

const main = async () => {
  const prodApp = admin.initializeApp(
    {
      credential: admin.credential.cert(configureAccount(prodServiceAccount, true)),
      databaseURL: 'https://idol-b6c68.firebaseio.com',
      storageBucket: 'gs://cornelldti-idol.appspot.com'
    },
    'prod'
  );
  const devApp = admin.initializeApp(
    {
      credential: admin.credential.cert(configureAccount(devServiceAccount, false)),
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
