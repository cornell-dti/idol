/* backend/scripts/upload-recruitment-events.ts */

import fs from 'fs';
import path from 'path';
import { db } from '../src/firebase';
import { deleteCollection } from '../src/utils/firebase-utils';
import type {
  RecruitmentEventDate,
  RecruitmentTimelineEvent
} from '../src/dao/RecruitmentTimelineDao';

type Cycle = 'freshmen' | 'upperclassmen' | 'spring';
type SourceRecruitmentTimelineEvent = Omit<RecruitmentTimelineEvent, 'id' | 'order'>;

const cycles: Cycle[] = ['freshmen', 'upperclassmen', 'spring'];
const monthNumbers: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

const RECRUITMENT_TIMELINE_COLLECTION = 'recruitment-timeline-events';
const forceUpload = process.argv.includes('--force');

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const getFallRecruitmentYear = (): number => {
  const year = Number(process.env.RECRUITMENT_FALL_YEAR);
  if (!Number.isInteger(year) || year < 2000) {
    throw new Error(
      'Set RECRUITMENT_FALL_YEAR to the year of the fall recruitment cycle, for example 2026.'
    );
  }
  return year;
};

const getSortDate = (date: string, fallRecruitmentYear: number): string => {
  const match = date.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/
  );
  if (!match) throw new Error(`Cannot infer an ISO sort date from "${date}".`);

  const month = monthNumbers[match[1]];
  const day = Number(match[2]);
  const year = month >= 8 ? fallRecruitmentYear : fallRecruitmentYear + 1;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const addSortDates = (
  event: SourceRecruitmentTimelineEvent,
  fallRecruitmentYear: number
): SourceRecruitmentTimelineEvent => {
  const normalizedEvent = { ...event };

  cycles.forEach((cycle) => {
    const eventDate = event[cycle];
    if (!eventDate) return;

    normalizedEvent[cycle] = {
      ...eventDate,
      sortDate: eventDate.sortDate ?? getSortDate(eventDate.date, fallRecruitmentYear)
    } as RecruitmentEventDate;
  });

  return normalizedEvent;
};

const main = async () => {
  const collection = db.collection(RECRUITMENT_TIMELINE_COLLECTION);
  const existingEvents = await collection.limit(1).get();

  if (!forceUpload && !existingEvents.empty) {
    throw new Error(
      `Refusing to upload because ${RECRUITMENT_TIMELINE_COLLECTION} is not empty. ` +
        'Re-run with --force to replace events from the JSON file.'
    );
  }

  const filePath = path.resolve(
    __dirname,
    '../../new-dti-website-redesign/src/app/apply/events.json'
  );

  const raw = fs.readFileSync(filePath, 'utf8');
  const { events } = JSON.parse(raw) as { events: SourceRecruitmentTimelineEvent[] };
  const fallRecruitmentYear = getFallRecruitmentYear();

  if (forceUpload && !existingEvents.empty) {
    await deleteCollection(db, RECRUITMENT_TIMELINE_COLLECTION, 500);
    // eslint-disable-next-line no-console
    console.log(`Deleted existing ${RECRUITMENT_TIMELINE_COLLECTION} events.`);
  }

  const batch = db.batch();

  events.forEach((sourceEvent, index: number) => {
    const event = addSortDates(sourceEvent, fallRecruitmentYear);
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
