import React from 'react';
import { Card } from 'semantic-ui-react';
import Link from 'next/link';
import TeamEventForm from './TeamEventForm';
import { Member } from '../../API/MembersAPI';
import styles from './TeamEvents.module.css';

export type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: Member[];
  membersApproved: Member[];
  uuid: string;
};

const TeamEvents: React.FC = () => {
  const teamEvents: TeamEvent[] = [
    {
      name: 'Coffee Chat',
      date: '2021-11-17',
      numCredits: '0.5',
      hasHours: false,
      membersPending: [],
      membersApproved: [],
      uuid: '1'
    },
    {
      uuid: '2',
      name: 'Club Fest',
      date: '2021-11-17',
      numCredits: '0.5',
      hasHours: true,
      membersPending: [],
      membersApproved: []
    }
  ];

  return (
    <div>
      <div className={styles.formWrapper}>
        <h1>Create a Team Event</h1>
        <TeamEventForm formType={'create'}></TeamEventForm>
      </div>

      <div className={styles.eventsWrapper}>
        <h2>View All Team Events</h2>
        <Card.Group>
          {teamEvents.map((teamEvent) => (
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

export default TeamEvents;
