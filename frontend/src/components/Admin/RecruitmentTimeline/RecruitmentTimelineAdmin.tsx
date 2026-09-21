import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Dropdown, Form, Label, Loader, Message } from 'semantic-ui-react';
import { Emitters } from '../../../utils';
import RecruitmentTimelineAPI, {
  RecruitmentTimelineEvent
} from '../../../API/RecruitmentTimelineAPI';
import styles from './RecruitmentTimelineAdmin.module.css';

type Cycle = 'freshmen' | 'upperclassmen' | 'spring';

const cycleOptions = [
  { key: 'upperclassmen', text: 'Upperclassmen', value: 'upperclassmen' },
  { key: 'freshmen', text: 'Freshmen/Transfer', value: 'freshmen' },
  { key: 'spring', text: 'Spring', value: 'spring' }
];

const eventTypeOptions = [
  { key: 'application', text: 'Application', value: 'application' },
  { key: 'deadline', text: 'Deadline', value: 'deadline' },
  { key: 'info', text: 'Info Session', value: 'info' },
  { key: 'interview', text: 'Interview', value: 'interview' },
  { key: 'offer', text: 'Offer', value: 'offer' },
  { key: 'workshop', text: 'Workshop', value: 'workshop' }
];

const RecruitmentTimelineAdmin = (): JSX.Element => {
  const [events, setEvents] = useState<RecruitmentTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<Cycle>('upperclassmen');
  const [eventType, setEventType] = useState<string>('info');

  useEffect(() => {
    RecruitmentTimelineAPI.getAllRecruitmentTimelineEvents()
      .then((recruitmentEvents) => {
        setEvents(Array.isArray(recruitmentEvents) ? recruitmentEvents : []);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: 'Error loading recruitment timeline events',
          contentMsg: error?.message ?? 'Something went wrong'
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const cycleEvents = useMemo(
    () => events.filter((event) => event[selectedCycle]),
    [events, selectedCycle]
  );

  return (
    <div>
      <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
        <div className={styles.createHeader}>
          <h1>Create a Recruitment Timeline Event</h1>
          <Label color="blue">Draft edits save to Firebase</Label>
        </div>
        <Form>
          <Form.Input label="Event Title" placeholder="Information Session 1" required />
          <Form.TextArea
            label="Description"
            placeholder="Describe what applicants should know about this event."
            required
          />
          <Form.Group widths="equal">
            <Form.Input label="Location" placeholder="Gates Hall" />
            <Form.Input label="Link" placeholder="https://..." />
          </Form.Group>
          <Form.Field required>
            <label>Event Type</label>
            <Dropdown
              selection
              options={eventTypeOptions}
              value={eventType}
              onChange={(_, data) => setEventType(data.value as string)}
            />
          </Form.Field>
          <Form.Group grouped>
            <label>Cycles</label>
            <Form.Checkbox label="Upperclassmen" />
            <Form.Checkbox label="Freshmen/Transfer" />
            <Form.Checkbox label="Spring" />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input label="Date" placeholder="September 1" required />
            <Form.Input label="Time" placeholder="6:30-8:00pm" />
          </Form.Group>
          <Form.Checkbox label="Tentative date" />
          <Button primary type="button">
            Add Event
          </Button>
        </Form>
      </div>

      <div className={styles.wrapper}>
        <h2>View All Recruitment Timeline Events</h2>
        <div className={styles.cycleControls}>
          <Dropdown
            selection
            options={cycleOptions}
            value={selectedCycle}
            onChange={(_, data) => setSelectedCycle(data.value as Cycle)}
          />
        </div>
        {isLoading ? (
          <Loader active inline />
        ) : cycleEvents.length === 0 ? (
          <Message>There are currently no recruitment timeline events for this cycle.</Message>
        ) : (
          <Card.Group>
            {cycleEvents.map((event) => {
              const cycleDate = event[selectedCycle];
              return (
                <Card key={event.id}>
                  <Card.Content>
                    <Card.Header>{event.title}</Card.Header>
                    <Card.Meta className={styles.eventMeta}>
                      <span>
                        {cycleDate?.date}
                        {cycleDate?.time ? `, ${cycleDate.time}` : ''}
                        {cycleDate?.isTentative ? ' (tentative)' : ''}
                      </span>
                      <span>Type: {event.type}</span>
                      {event.location && <span>Location: {event.location}</span>}
                    </Card.Meta>
                    <Card.Description>{event.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className={styles.eventActions}>
                      <Button basic color="blue" type="button">
                        Edit
                      </Button>
                      <Button basic color="red" type="button">
                        Delete
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        )}
        <div className={styles.buttonContainer}>
          <div>
            <Button color="blue" type="button">
              Create Website PR
            </Button>
            <p className={styles.publishNote}>
              Use this only after all timeline changes are ready for the website.
            </p>
          </div>
          <Button basic type="button">
            Preview Diff
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentTimelineAdmin;
