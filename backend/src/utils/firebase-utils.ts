/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Takes service account credentials and populates the private_key_id and private_key fields with data from the .env.
 * @param serviceAccount - Service Account object containing non-sensitive Firebase credentials.
 * @param isProd - Whether or not we should use the Firebase prod credentials. If False, the development DB credentials are used.
 * @returns - Credentials object with private key and private key id.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const configureAccount = (serviceAccount: any, isProd: boolean) => {
  const configAcc = serviceAccount;
  let parsedPK;
  try {
    parsedPK = isProd
      ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)
      : JSON.parse(process.env.FIREBASE_DEV_PRIVATE_KEY as string);
  } catch (err) {
    parsedPK = isProd ? process.env.FIREBASE_PRIVATE_KEY : process.env.FIREBASE_DEV_PRIVATE_KEY;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id = isProd
    ? process.env.FIREBASE_PRIVATE_KEY_ID
    : process.env.FIREBASE_DEV_PRIVATE_KEY_ID;
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
