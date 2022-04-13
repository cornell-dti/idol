import React, { useEffect, useState } from 'react';
import { Card, Message } from 'semantic-ui-react';
import Link from 'next/link';
import TeamEventForm from './TeamEventForm';
import styles from './TeamEvents.module.css';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';
import { Emitters } from '../../utils';

const TeamEvents: React.FC = () => {
  const [teamEvents, setTeamEvents] = useState<TeamEvent[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fullReset = () => {
    setLoading(true);
    setTeamEvents([]);
  };

  useEffect(() => {
    const cb = () => {
      fullReset();
    };
    Emitters.teamEventsUpdated.subscribe(cb);
    return () => {
      Emitters.teamEventsUpdated.unsubscribe(cb);
    };
  });

  useEffect(() => {
    if (isLoading) {
      TeamEventsAPI.getAllTeamEvents().then((teamEvents) => {
        setTeamEvents(teamEvents);
        setLoading(false);
      });
    }
  }, [isLoading]);

  return (
    <div>
      <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
        <h1>Create a Team Event</h1>
        <TeamEventForm formType={'create'}></TeamEventForm>
      </div>
      <div className={styles.wrapper}>
        <h2>View All Team Events</h2>
        {teamEvents.length !== 0 ? (
          <Card.Group>
            {teamEvents.map((teamEvent) => (
              <Link key={teamEvent.uuid} href={`/admin/team-event-details/${teamEvent.uuid}`}>
                <Card>
                  <Card.Content>
                    <Card.Header>{teamEvent.name} </Card.Header>
                    <Card.Meta>{teamEvent.date}</Card.Meta>
                    <Card.Meta>{teamEvent.requests.length} pending requests</Card.Meta>
                  </Card.Content>
                </Card>
              </Link>
            ))}
          </Card.Group>
        ) : (
          <Message>There are currently no team event forms.</Message>
        )}
      </div>
    </div>
  );
};

export default TeamEvents;
