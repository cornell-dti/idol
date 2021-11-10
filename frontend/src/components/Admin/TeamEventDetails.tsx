import React from 'react';
import { Card, Message } from 'semantic-ui-react';
import Link from 'next/link';
import { Member } from '../../API/MembersAPI';
import styles from './TeamEventDetails.module.css';

type TeamEvent = {
  uuid: string;
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: Member[];
  membersApproved: Member[];
};

const mockTeamEvent: TeamEvent = {
  name: 'Info Session',
  date: 'Sept 3',
  numCredits: '1',
  hasHours: false,
  membersPending: [],
  membersApproved: [],
  uuid: '1'
};

const TeamEventDetails: React.FC = () => (
  // use query.uuid to fetch the team event from firebase
  // const { query } = useRouter();

  <div className={styles.container}>
    <Link href="/admin/team-events">
      <p className={styles.arrow}>&#8592;</p>
    </Link>
    <h1 className={styles.eventName}>{mockTeamEvent.name}</h1>
    <h2 className={styles.eventDate}>{mockTeamEvent.date}</h2>

    <div className={styles.listsContainer}>
      <div className={styles.listContainer}>
        <h2 className={styles.memberTitle}>Members Pending</h2>

        {mockTeamEvent.membersPending.length > 0 ? (
          <Card.Group>
            {mockTeamEvent.membersPending.map((member) => (
              <Card key={member.netid}>
                <Card.Content>
                  <Card.Header>
                    {member.firstName} {member.lastName}
                  </Card.Header>
                  <Card.Meta>{member.email}</Card.Meta>
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

        {mockTeamEvent.membersApproved.length > 0 ? (
          <Card.Group>
            {mockTeamEvent.membersApproved.map((member) => (
              <Card key={member.netid}>
                <Card.Content>
                  <Card.Header>
                    {member.firstName} {member.lastName}
                  </Card.Header>
                  <Card.Meta>{member.email}</Card.Meta>
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
