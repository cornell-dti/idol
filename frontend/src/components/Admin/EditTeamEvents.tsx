import React, { useState } from 'react';
import { Form, Radio, Card } from 'semantic-ui-react';
import Link from 'next/link';
import { Emitters } from '../../utils';
import { Member } from '../../API/MembersAPI';
import styles from './EditTeamEvents.module.css';

type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: Member[];
  membersApproved: Member[];
  uuid: string;
};

const EditTeamEvents: React.FC = () => {
  const [teamEventName, setTeamEventName] = useState('');
  const [teamEventDate, setTeamEventDate] = useState('');
  const [teamEventCreditNum, setTeamEventCreditNum] = useState('');
  const [teamEventHasHours, setTeamEventHasHours] = useState(false);

  const teamEvents: TeamEvent[] = [
    {
      name: 'Coffee Chat',
      date: 'Sept 3',
      numCredits: '0.5',
      hasHours: false,
      membersPending: [],
      membersApproved: [],
      uuid: '1'
    },
    {
      uuid: '2',
      name: 'Club Fest',
      date: 'Sept 5',
      numCredits: '0.5',
      hasHours: true,
      membersPending: [],
      membersApproved: []
    }
  ];

  const createTeamEvent = (teamEvent: TeamEvent) => {
    // send new event to backend
  };

  const submitTeamEvent = () => {
    if (!teamEventName) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Name',
        contentMsg: 'Please enter the name of the team event!'
      });
    } else if (!teamEventDate) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Date',
        contentMsg: 'Please enter the date of the team event!'
      });
    } else if (
      !teamEventCreditNum ||
      teamEventCreditNum === '' ||
      isNaN(Number(teamEventCreditNum)) ||
      Number(teamEventCreditNum) < 1
    ) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Credit Amount',
        contentMsg: 'Please enter how many credits the event is worth!'
      });
    } else {
      // fix
      const newTeamEvent: TeamEvent = {
        uuid: '',
        name: teamEventName,
        date: teamEventDate,
        numCredits: teamEventCreditNum,
        hasHours: teamEventHasHours,
        membersPending: [],
        membersApproved: []
      };
      createTeamEvent(newTeamEvent);
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Created!',
        contentMsg: 'The team event was successfully created!'
      });
    }
  };

  return (
    <div>
      <Form className={styles.form}>
        <h1>Create a Team Event</h1>
        <Form.Input
          value={teamEventName}
          onChange={(event) => setTeamEventName(event.target.value)}
          label={
            <label className={styles.label}>
              Event Name: <span className={styles.required}>*</span>
            </label>
          }
        ></Form.Input>

        <Form.Input
          value={teamEventDate}
          onChange={(event) => {
            setTeamEventDate(event.target.value);
          }}
          type="date"
          label={
            <label className={styles.label}>
              Event Date: <span className={styles.required}>*</span>
            </label>
          }
        ></Form.Input>

        <Form.Input
          value={teamEventCreditNum}
          onChange={(event) => {
            setTeamEventCreditNum(event.target.value);
          }}
          type="number"
          step="0.5"
          label={
            <label className={styles.label}>
              How many credits is this event worth? <span className={styles.required}>*</span>
            </label>
          }
        ></Form.Input>

        <label htmlFor="radioGroup" className={styles.label}>
          Does this event have hours? <span className={styles.required}>*</span>
        </label>
        <Form.Field>
          <Radio
            label="Yes"
            name="radioGroup"
            value="Yes"
            checked={teamEventHasHours}
            onChange={() => setTeamEventHasHours(true)}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="No"
            name="radioGroup"
            value="No"
            checked={!teamEventHasHours}
            onChange={() => setTeamEventHasHours(false)}
          />
        </Form.Field>

        <Form.Button floated="right" onClick={submitTeamEvent}>
          Create Event
        </Form.Button>
      </Form>

      <div style={{ width: '60%', margin: 'auto' }}>
        <h2>View All Team Events</h2>
        <Card.Group>
          {teamEvents.map((teamEvent, i) => (
            <Link key={teamEvent.uuid} href={`/admin/team-event-details/${teamEvent.uuid}`}>
              <Card>
                <Card.Content>
                  <Card.Header>{teamEvent.name} </Card.Header>
                  <Card.Meta>{teamEvent.date}</Card.Meta>
                </Card.Content>
              </Card>
            </Link>
          ))}
        </Card.Group>
      </div>
    </div>
  );
};

export default EditTeamEvents;
