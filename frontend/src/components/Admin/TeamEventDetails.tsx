import React from 'react';
import { Card, Message, Modal, Button } from 'semantic-ui-react';
import Link from 'next/link';
import EditTeamEvent from './EditTeamEvent';
import styles from './TeamEventDetails.module.css';

const mockTeamEvent: TeamEvent = {
  name: 'Info Session',
  date: '2021-11-17',
  numCredits: '1',
  hasHours: false,
  requests: [],
  attendees: [],
  uuid: '1'
};

const TeamEventDetails: React.FC = () => (
  // use query.uuid to fetch the team event from firebase
  // const { query } = useRouter();

  <div className={styles.container}>
    <div className={styles.arrowAndButtons}>
      <Link href="/admin/team-events">
        <span className={styles.arrow}>&#8592;</span>
      </Link>

      <div>
        <EditTeamEvent teamEvent={mockTeamEvent}></EditTeamEvent>
        <Modal
          trigger={<Button color="red">Delete Event</Button>}
          header="Delete Team Event"
          content="Are you sure that you want to delete this event?"
          actions={['Cancel', { key: 'deleteEvent', content: 'Delete Event', color: 'red' }]}
        />
      </div>
    </div>

    <h1 className={styles.eventName}>{mockTeamEvent.name}</h1>
    <h2 className={styles.eventDate}>{mockTeamEvent.date}</h2>

    <div className={styles.listsContainer}>
      <div className={styles.listContainer}>
        <h2 className={styles.memberTitle}>Members Pending</h2>

        {mockTeamEvent.requests.length > 0 ? (
          <Card.Group>
            {mockTeamEvent.requests.map((req) => (
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

        {mockTeamEvent.attendees.length > 0 ? (
          <Card.Group>
            {mockTeamEvent.attendees.map((req) => (
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
export default TeamEventDetails;
