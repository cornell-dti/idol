import * as firebase from 'firebase-admin';
import { teamEventAdminCollection } from './firebase';

const getAllTECAdmin = async () => {
  const snapshot = await teamEventAdminCollection.get();
  const docs = snapshot.docs.map((doc) => doc.data());
  console.log(docs);
}

getAllTECAdmin();