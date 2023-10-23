/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

type DbType = 'prod' | 'dev' | 'backup';

type DbData = {
  id: string;
  docs: {
    id: string;
    data: unknown;
  }[];
}[];

/**
 * Takes service account credentials and populates the private_key_id and private_key fields with data from the .env.
 * @param serviceAccount - Service Account object containing non-sensitive Firebase credentials.
 * @param isProd - Whether or not we should use the Firebase prod credentials. If False, the development DB credentials are used.
 * @returns - Credentials object with private key and private key id.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const configureAccount = (serviceAccount: any, dbType: DbType) => {
  const configAcc = serviceAccount;
  let parsedPK;
  try {
    if (dbType === 'prod') {
      parsedPK = JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string);
    } else if (dbType === 'dev') {
      parsedPK = JSON.parse(process.env.FIREBASE_DEV_PRIVATE_KEY as string);
    } else if (dbType === 'backup') {
      parsedPK = JSON.parse(process.env.FIREBASE_BACKUP_PRIVATE_KEY as string);
    }
  } catch (err) {
    if (dbType === 'prod') {
      parsedPK = process.env.FIREBASE_PRIVATE_KEY;
    } else if (dbType === 'dev') {
      parsedPK = process.env.FIREBASE_DEV_PRIVATE_KEY;
    } else if (dbType === 'backup') {
      parsedPK = process.env.FIREBASE_BACKUP_PRIVATE_KEY;
    }
  }
  configAcc.private_key = parsedPK;
  if (dbType === 'prod') {
    configAcc.private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID;
  } else if (dbType === 'dev') {
    configAcc.private_key_id = process.env.FIREBASE_DEV_PRIVATE_KEY_ID;
  } else if (dbType === 'backup') {
    configAcc.private_key_id = process.env.FIREBASE_BACKUP_PRIVATE_KEY_ID;
  }
  return configAcc;
};

/**
 * Deletes an entire collection by deleting the documents in batches of batchSize.
 * @param db - The database in which the collection will be deleted.
 * @param collectionPath - Path associated with the collection to be deleted.
 * @param batchSize - Whether or not we should use the Firebase prod credentials. If False, the development DB credentials are used.
 */
export async function deleteCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  batchSize: number
): Promise<void> {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

/**
 * Recursive function that deletes all documents in the db that match query.
 * @param db - The database in which the documents will be deleted.
 * @param query - Query describing the documents that will be deleted.
 * @param resolve - The callback function called upon deleting all documents that match the query.
 */
export async function deleteQueryBatch(
  db: FirebaseFirestore.Firestore,
  query: FirebaseFirestore.Query,
  resolve: () => void
): Promise<void> {
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

/**
 * Reads all data in the collections from the DB and returns it.
 * @param db - The database in which the collections will be read from.
 * @returns The data from the DB as a DbData object.
 */
export const readDbData = async (db: FirebaseFirestore.Firestore): Promise<DbData> => {
  const allCollections = await db.listCollections();
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

/**
 * Writes all data in the collections from the DB and returns it as DbData object.
 * @param db - The database in which the data will be written to.
 * @param data - The data to be written to db.
 * @returns - A promise that is resolved once all the data is written to the DB.
 */
export const rewriteDbData = async (
  db: FirebaseFirestore.Firestore,
  data: DbData
): Promise<void[]> => {
  const allCollections = await db
    .listCollections()
    .then((collections) => collections.map((collection) => collection.id));

  await Promise.all(allCollections.map((collection) => deleteCollection(db, collection, 10)));
  return data.map((collection) =>
    collection.docs.forEach((doc) => db.doc(`${collection.id}/${doc.id}`).set(doc.data))
  );
};
