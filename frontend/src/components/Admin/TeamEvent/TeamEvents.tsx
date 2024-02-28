import React, { useEffect, useState } from 'react';
import { Card, Message, Loader, Button } from 'semantic-ui-react';
import Link from 'next/link';
import TeamEventForm from './TeamEventForm';
import styles from './TeamEvents.module.css';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';
import ClearTeamEventsModal from '../../Modals/ClearTeamEventsModal';
import { INITIATIVE_EVENTS } from '../../../consts';

type TeamEventsDisplayProps = {
  isLoading: boolean;
  teamEvents: TeamEvent[];
};

const TeamEventsDisplay: React.FC<TeamEventsDisplayProps> = ({ isLoading, teamEvents }) => {
  if (isLoading) return <Loader active inline />;
  return (
    <>
      {teamEvents && teamEvents.length !== 0 ? (
        <Card.Group>
          {teamEvents.map((teamEvent) => {
            const countPendingRequests = teamEvent.requests.filter(
              (req) => req.status === 'pending'
            ).length;
            return (
              <Link key={teamEvent.uuid} href={`/admin/team-event-details/${teamEvent.uuid}`}>
                <Card>
                  <Card.Content>
                    <Card.Header>{teamEvent.name} </Card.Header>
                    <Card.Meta>{teamEvent.date}</Card.Meta>
                    <Card.Meta>
                      {countPendingRequests > 0 ? (
                        <p className={styles.alertPendingRequests}>
                          {countPendingRequests} pending requests
                        </p>
                      ) : (
                        `0 pending requests`
                      )}
                    </Card.Meta>
                    {INITIATIVE_EVENTS && (
                      <Card.Meta>
                        Initiative Event: {teamEvent.isCommunity ? 'Yes' : 'No'}
                      </Card.Meta>
                    )}
                  </Card.Content>
                </Card>
              </Link>
            );
          })}
        </Card.Group>
      ) : (
        <Message>There are currently no team event forms.</Message>
      )}
    </>
  );
};

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
        <div>
          <h2>View All Team Events</h2>
          <TeamEventsDisplay isLoading={isLoading} teamEvents={teamEvents} />
        </div>
        <div className={styles.buttonContainer}>
          <Button>
            <Link href="/admin/team-events/dashboard">View Team Events Dashboard</Link>
          </Button>
          <ClearTeamEventsModal setTeamEvents={setTeamEvents} />
        </div>
      </div>
    </div>
  );
};

export default TeamEvents;
