// run 'yarn ts-node --transpile-only src/dao/remove-pending-field.ts' once in backend directory

// eslint-disable-next-line import/no-extraneous-dependencies
import { FieldValue } from '@google-cloud/firestore';
import { teamEventAttendanceCollection } from '../firebase';

const removePending = async () => {
    const docs = await teamEventAttendanceCollection.listDocuments();

    docs.forEach(async (doc) => {
        await doc.update({pending: FieldValue.delete()});
        // console.log((await doc.get()).data());
        // console.log(attendance.uuid === (await doc.get()).data()?.uuid)
    });
};

removePending();
