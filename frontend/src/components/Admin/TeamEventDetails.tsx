import React, { useEffect, useState } from 'react';
import { Card, Message, Modal, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EditTeamEvent from './EditTeamEvent';
import styles from './TeamEventDetails.module.css';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';

const defaultTeamEvent: TeamEvent = {
  name: '',
  date: '',
  numCredits: '',
  hasHours: false,
  requests: [],
  attendees: [],
  uuid: ''
};

const TeamEventDetails: React.FC = () => {
  const location = useRouter();
  const uuid = location.query.uuid as string;
  const [teamEvent, setTeamEvent] = useState<TeamEvent>(defaultTeamEvent);

  useEffect(() => {
    TeamEventsAPI.getTeamEventForm(uuid).then((teamEvent) => setTeamEvent(teamEvent));
    console.log("here");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.arrowAndButtons}>
        <Link href="/admin/team-events">
          <span className={styles.arrow}>&#8592;</span>
        </Link>
        <div>
          <EditTeamEvent teamEvent={teamEvent}></EditTeamEvent>
          <Modal
            trigger={<Button color="red">Delete Event</Button>}
            header="Delete Team Event"
            content="Are you sure that you want to delete this event?"
            actions={['Cancel', { key: 'deleteEvent', content: 'Delete Event', color: 'red' }]}
          />
        </div>
      </div>

      <h1 className={styles.eventName}>{teamEvent.name}</h1>
      <div className={styles.eventDetailsContainer}>
        <h3 className={styles.eventDetails}>Date: {teamEvent.date}</h3>
        <h3 className={styles.eventDetails}>Credits: {teamEvent.numCredits}</h3>
        <h3 className={styles.eventDetails}>Has Hours: {teamEvent.hasHours ? 'yes' : 'no'}</h3>
      </div>

      <div className={styles.listsContainer}>
        <div className={styles.listContainer}>
          <h2 className={styles.memberTitle}>Members Pending</h2>

          {teamEvent.requests.length > 0 ? (
            <Card.Group>
              {teamEvent.requests.map((req) => (
                <Card key={req.member.netid}>
                  <Card.Content>
                    <Card.Header>
                      {req.member.firstName} {req.member.lastName}
                    </Card.Header>
                    <Card.Meta>{req.member.email}</Card.Meta>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <Message>There are currently no pending members for this event.</Message>
          )}
        </div>

        <div className={styles.listContainer}>
          <h2 className={styles.memberTitle}>Members Approved</h2>

          {teamEvent.attendees.length > 0 ? (
            <Card.Group>
              {teamEvent.attendees.map((req) => (
                <Card key={req.member.netid}>
                  <Card.Content>
                    <Card.Header>
                      {req.member.firstName} {req.member.lastName}
                    </Card.Header>
                    <Card.Meta>{req.member.email}</Card.Meta>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <Message>There are currently no approved members for this event.</Message>
          )}
        </div>
      </div>
    </div>
  );
};
export default TeamEventDetails;
