import * as firebase from 'firebase-admin';
import { teamEventAttendanceCollection } from '../firebase';
// import { createStatusFromPending } from '../API/teamEventsAPI';

const deletePending = async () => {
  const docs = await teamEventAttendanceCollection.listDocuments();
  docs.forEach(async (doc) => {
    await doc.update({
      pending: firebase.firestore.FieldValue.delete()
    });
  });
};

const setReason = async () => {
  const docs = await teamEventAttendanceCollection.listDocuments();
  docs.forEach(async (doc) => {
    await doc.update({
      reason: ''
    });
  });
};

deletePending();
setReason();
// createStatusFromPending();
