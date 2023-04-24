import React, { useEffect, useState } from 'react';
import { Card, Message, Loader, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { ExportToCsv, Options } from 'export-to-csv';
import TeamEventForm from './TeamEventForm';
import styles from './TeamEvents.module.css';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';
import ClearTeamEventsModal from '../../Modals/ClearTeamEventsModal';

type TeamEventsDisplayProps = {
  isLoading: boolean;
  teamEvents: TeamEvent[];
};

// remove this variable and usage when community events ready to be released
const COMMUNITY_EVENTS = false;

const TeamEventsDisplay: React.FC<TeamEventsDisplayProps> = ({ isLoading, teamEvents }) => {
  if (isLoading) return <Loader active inline />;
  return (
    <>
      {teamEvents && teamEvents.length !== 0 ? (
        <Card.Group>
          {teamEvents.map((teamEvent) => (
            <Link key={teamEvent.uuid} href={`/admin/team-event-details/${teamEvent.uuid}`}>
              <Card>
                <Card.Content>
                  <Card.Header>{teamEvent.name} </Card.Header>
                  <Card.Meta>{teamEvent.date}</Card.Meta>
                  <Card.Meta>{teamEvent.requests.length} pending requests</Card.Meta>
                  {COMMUNITY_EVENTS && (
                    <Card.Meta>Community Event: {teamEvent.isCommunity ? 'Yes' : 'No'}</Card.Meta>
                  )}
                </Card.Content>
              </Card>
            </Link>
          ))}
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

  const handleExportToCsv = () => {
    if (isLoading) {
      return;
    }

    const csvData = teamEvents
      .map((event) => {
        const { attendees, requests, ...info } = event;
        const infoArray = [
          info.name,
          info.date,
          info.numCredits,
          info.hasHours,
          info.uuid,
          info.isCommunity
        ];
        return attendees
          .map(({ member: { netid }, hoursAttended, image }) => [
            ...infoArray,
            netid,
            hoursAttended || 0,
            image,
            true
          ])
          .concat(
            requests.map(({ member: { netid }, hoursAttended, image }) => [
              ...infoArray,
              netid,
              hoursAttended || 0,
              image,
              false
            ])
          );
      })
      .flat();

    const header = [
      'name',
      'date',
      'numCredits',
      'hasHours',
      'uuid',
      'isCommunity',
      'netid',
      'hoursAttended',
      'image',
      'attendee'
    ];

    const options: Options = {
      filename: `Team_Events`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Team Events`,
      useTextFile: false,
      useBom: true
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter?.generateCsv([header, ...csvData]);
  };

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
        <div className={styles.resetButtonContainer}>
          <Button onClick={() => handleExportToCsv()}>Export to CSV</Button>
          <ClearTeamEventsModal setTeamEvents={setTeamEvents} />
        </div>
      </div>
    </div>
  );
};

export default TeamEvents;
