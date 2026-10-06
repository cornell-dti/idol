import { RecruitmentTimelineEvent } from '../src/dao/RecruitmentTimelineDao';
import { serializeRecruitmentTimelineEvents } from '../src/utils/recruitmentTimelineWebsite';

describe('serializeRecruitmentTimelineEvents', () => {
  it('removes Firebase-only fields and retains the website event shape', () => {
    const events: RecruitmentTimelineEvent[] = [
      {
        id: '1-later-event',
        order: 1,
        title: 'Later Event',
        description: 'Second event',
        type: 'info',
        freshmen: {
          date: 'September 2',
          sortDate: '2026-09-02',
          time: '6-7PM',
          isTentative: false
        }
      },
      {
        id: '0-first-event',
        order: 0,
        title: 'First Event',
        description: 'First event',
        location: 'Gates Hall',
        link: 'https://example.com',
        type: 'application',
        upperclassmen: {
          date: 'August 30',
          sortDate: '2026-08-30',
          isTentative: true
        }
      }
    ];

    expect(serializeRecruitmentTimelineEvents(events)).toEqual(`{
  "events": [
    {
      "title": "First Event",
      "description": "First event",
      "location": "Gates Hall",
      "type": "application",
      "link": "https://example.com",
      "upperclassmen": { "date": "August 30", "isTentative": true }
    },
    {
      "title": "Later Event",
      "description": "Second event",
      "type": "info",
      "freshmen": { "date": "September 2", "isTentative": false, "time": "6-7PM" }
    }
  ]
}\n`);
  });
});
