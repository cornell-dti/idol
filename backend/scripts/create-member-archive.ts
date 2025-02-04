import * as fs from 'fs';
import { approvedMemberCollection } from '../src/firebase';

const semester = process.argv[2];

if (!semester) {
  // eslint-disable-next-line no-console
  console.error('Please provide a semester identifier (e.g., fa24) as an argument');
  process.exit(1);
}

approvedMemberCollection.get().then(async (colRef) => {
  const members = await Promise.all(colRef.docs.map((doc) => doc.data()));
  fs.writeFileSync(
    `src/members-archive/${semester}.json`,
    JSON.stringify({ members }, undefined, 2)
  );
});
