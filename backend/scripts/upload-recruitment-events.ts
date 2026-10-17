/* backend/scripts/upload-recruitment-events.ts */

import fs from 'fs';
import path from 'path';
import { RecruitmentTimelineEvent } from '../src/dao/RecruitmentTimelineDao';
import { db } from '../src/firebase';

type RecruitmentTimelineEventUpload = Omit<RecruitmentTimelineEvent, 'id' | 'order'>;

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const main = async () => {
  const filePath = path.resolve(
    __dirname,
    '../../new-dti-website-redesign/src/app/apply/events.json'
  );

  const raw = fs.readFileSync(filePath, 'utf8');
  const { events } = JSON.parse(raw) as { events: RecruitmentTimelineEventUpload[] };

  const batch = db.batch();

  events.forEach((event, index) => {
    const id = `${index}-${slugify(event.title)}`;
    const ref = db.collection('recruitment-timeline-events').doc(id);

    batch.set(ref, {
      ...event,
      order: index,
      updatedAt: new Date().toISOString()
    });
  });

  await batch.commit();
  // eslint-disable-next-line no-console
  console.log(`Uploaded ${events.length} recruitment timeline events.`);
};

main();
