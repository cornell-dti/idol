/* backend/scripts/upload-recruitment-events.ts */

import fs from 'fs';
import path from 'path';
import { db } from '../src/firebase';

type RecruitmentTimelineEventUpload = Omit<RecruitmentTimelineEvent, 'id' | 'order'>;

const RECRUITMENT_TIMELINE_COLLECTION = 'recruitment-timeline-events';
const forceUpload = process.argv.includes('--force');

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const main = async () => {
  const collection = db.collection(RECRUITMENT_TIMELINE_COLLECTION);
  const existingEvents = await collection.limit(1).get();

  if (!forceUpload && !existingEvents.empty) {
    throw new Error(
      `Refusing to upload because ${RECRUITMENT_TIMELINE_COLLECTION} is not empty. ` +
        'Re-run with --force to overwrite events from the JSON file.'
    );
  }

  const filePath = path.resolve(
    __dirname,
    '../../new-dti-website-redesign/src/app/apply/events.json'
  );

  const raw = fs.readFileSync(filePath, 'utf8');
  const { events } = JSON.parse(raw) as { events: RecruitmentTimelineEventUpload[] };

  const batch = db.batch();

  events.forEach((event, index) => {
    const id = `${index}-${slugify(event.title)}`;
    const ref = collection.doc(id);

    batch.set(ref, {
      ...event,
      order: index
    });
  });

  await batch.commit();
  // eslint-disable-next-line no-console
  console.log(`Uploaded ${events.length} recruitment timeline events.`);
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
