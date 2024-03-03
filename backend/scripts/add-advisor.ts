import { memberCollection, approvedMemberCollection } from '../src/firebase';

const addAdvisor = async (collection) => {
  const docs = await collection.listDocuments();
  docs.forEach(async (doc) => {
    await doc.update({
      isAdvisor: false
    });
  });
};

addAdvisor(memberCollection);
addAdvisor(approvedMemberCollection);
