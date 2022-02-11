import React from 'react';
import { Card, Button, Message, Image } from 'semantic-ui-react';
import Link from 'next/link';
import TeamEventForm from './TeamEventForm';
import styles from './TeamEvents.module.css';
import AramHeadshot from '../../static/images/aram-headshot.jpg';
import { convertCompilerOptionsFromJson } from 'typescript';

const TeamEvents: React.FC = () => {
  const teamEvents: TeamEvent[] = [
    {
      name: 'Coffee Chat',
      date: '2021-11-17',
      numCredits: '0.5',
      hasHours: false,
      requests: [],
      attendees: [],
      uuid: '1'
    },
    {
      uuid: '2',
      name: 'Club Fest',
      date: '2021-11-17',
      numCredits: '0.5',
      hasHours: true,
      requests: [],
      attendees: []
    }
  ];

  const pendingRequests: TeamEventAttendance[] = [];

  const handleCreditRequest = () => {
    console.log('handleCreditRequest'); // just want to trigger re-run
    // if approved, move to approved list of the event
    // remove from total pending list and event pending list
  };

  return (
    <div>
      <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
        <h1>Create a Team Event</h1>
        <TeamEventForm formType={'create'}></TeamEventForm>
      </div>
      <div className={styles.wrapper}>
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
      <div className={styles.wrapper}>
        <h2>Approve Pending Credit Requests</h2>

        {pendingRequests.length !== 0 ? (
          <Card.Group>
            {pendingRequests.map((request, i) => (
              <Card className={styles.memberCard} key={i}>
                <Card.Content>
                  <Image size="medium" className={styles.creditImage} src={AramHeadshot.src} />
                  <Card.Header>
                    {request.member.firstName} {request.member.lastName}
                  </Card.Header>
                  <Card.Meta>{request.member.email}</Card.Meta>
                  {request.hoursAttended && (
                    <Card.Description> Hours Attended: {request.hoursAttended}</Card.Description>
                  )}
                </Card.Content>
                <Card.Content extra>
                  <Button basic color="green" onClick={handleCreditRequest}>
                    Approve
                  </Button>
                  <Button basic color="red" onClick={handleCreditRequest}>
                    Reject
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        ) : (
          <Message>There are currently no pending credit requests.</Message>
        )}
      </div>
    </div>
  );
};

export default TeamEvents;
