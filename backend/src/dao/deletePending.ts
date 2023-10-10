import * as firebase from 'firebase-admin';
import { teamEventAttendanceCollection } from '../firebase';

const deletePending = async () => {
  const docs = await teamEventAttendanceCollection.listDocuments();
  docs.forEach(async (doc) => {
    await doc.update({
      pending: firebase.firestore.FieldValue.delete()
    });
  });
};

deletePending();
