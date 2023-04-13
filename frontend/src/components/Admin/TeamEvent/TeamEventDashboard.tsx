import React, { useState, useEffect } from 'react';
import { Table, Header, Loader } from 'semantic-ui-react';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { REQUIRED_LEAD_TEC_CREDITS, REQUIRED_MEMBER_TEC_CREDITS } from '../../../consts';
import styles from './TeamEventDashboard.module.css';

const calculateMemberCreditsForEvent = (member: IdolMember, event: TeamEvent): number =>
  event.attendees.reduce((val: number, attendee) => {
    if (attendee.member.email !== member.email) {
      return val;
    }
    if (event.hasHours && attendee.hoursAttended)
      return val + Number(event.numCredits) * attendee.hoursAttended;
    return val + Number(event.numCredits);
  }, 0);

const TeamEventDashboard: React.FC = () => {
  const [teamEvents, setTeamEvents] = useState<TeamEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const allMembers = useMembers();

  useEffect(() => {
    TeamEventsAPI.getAllTeamEvents().then((events) => {
      setTeamEvents(events);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loader active>Fetching team event data...</Loader>;

  return (
    <div className={styles.dashboardContainer}>
      <Header as="h1" textAlign="center">
        Team Event Dashboard
      </Header>
      <div className={styles.tableContainer}>
        <Table celled selectable striped classname={styles.dashboardTable}>
          <Table.Header>
            <Table.HeaderCell className={styles.nameCell}>Name</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            {teamEvents.map((event) => (
              <Table.HeaderCell>{event.name}</Table.HeaderCell>
            ))}
          </Table.Header>
          <Table.Body>
            {allMembers.map((member) => {
              const totalCredits = teamEvents.reduce(
                (val, event) => val + calculateMemberCreditsForEvent(member, event),
                0
              );
              const requirementMet =
                totalCredits >=
                (member.role === 'lead' ? REQUIRED_LEAD_TEC_CREDITS : REQUIRED_MEMBER_TEC_CREDITS);

              return (
                <Table.Row>
                  <Table.Cell positive={requirementMet} className={styles.nameCell}>
                    {member.firstName} {member.lastName} ({member.netid})
                  </Table.Cell>
                  <Table.Cell positive={requirementMet}>{totalCredits}</Table.Cell>
                  {teamEvents.map((event) => {
                    const numCredits = calculateMemberCreditsForEvent(member, event);
                    return <Table.Cell className={styles.eventCell}>{numCredits}</Table.Cell>;
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default TeamEventDashboard;
