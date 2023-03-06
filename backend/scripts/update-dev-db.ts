import admin from 'firebase-admin';
import configureAccount from '../src/utils/firebase-utils';

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

async function deleteCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  batchSize: number
) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(
  db: FirebaseFirestore.Firestore,
  query: FirebaseFirestore.Query,
  resolve
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

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
  return data.map((collection) =>
    collection.docs.forEach((doc) => devDb.doc(`${collection.id}/${doc.id}`).set(doc.data))
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
