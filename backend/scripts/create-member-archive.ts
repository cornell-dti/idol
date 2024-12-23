import * as fs from 'fs';
import { approvedMemberCollection } from '../src/firebase';

approvedMemberCollection.get().then(async (colRef) => {
  const members = await Promise.all(colRef.docs.map((doc) => doc.data()));
  fs.writeFileSync('src/members-archive/fa24.json', JSON.stringify({ members }, undefined, 2));
});
