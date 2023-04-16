import React, { useState, useEffect } from 'react';
import { Table, Header, Loader } from 'semantic-ui-react';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import {
  REQUIRED_LEAD_TEC_CREDITS,
  REQUIRED_MEMBER_TEC_CREDITS,
  REQUIRED_COMMUNITY_CREDITS
} from '../../../consts';
import styles from './TeamEventDashboard.module.css';

// remove this and its usage if/when community events are released
const COMMUNITY_EVENTS = false;

const calculateMemberCreditsForEvent = (
  member: IdolMember,
  event: TeamEvent,
  isCommunity: boolean
): number =>
  event.attendees.reduce((val: number, attendee) => {
    if (attendee.member.email !== member.email || (isCommunity && !event.isCommunity)) {
      return val;
    }
    if (event.hasHours && attendee.hoursAttended)
      return val + Number(event.numCredits) * attendee.hoursAttended;
    return val + Number(event.numCredits);
  }, 0);

const calculateTotalCreditsForEvent = (member: IdolMember, event: TeamEvent): number =>
  calculateMemberCreditsForEvent(member, event, false);

const calculateCommunityCreditsForEvent = (member: IdolMember, event: TeamEvent): number =>
  calculateMemberCreditsForEvent(member, event, true);

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
            {COMMUNITY_EVENTS && <Table.HeaderCell>Total Community Credits</Table.HeaderCell>}
            {teamEvents.map((event) => (
              <Table.HeaderCell>{event.name}</Table.HeaderCell>
            ))}
          </Table.Header>
          <Table.Body>
            {allMembers.map((member) => {
              const totalCredits = teamEvents.reduce(
                (val, event) => val + calculateTotalCreditsForEvent(member, event),
                0
              );
              const communityCredits = teamEvents.reduce(
                (val, event) => calculateCommunityCreditsForEvent(member, event),
                0
              );
              const totalCreditsMet =
                totalCredits >=
                (member.role === 'lead' ? REQUIRED_LEAD_TEC_CREDITS : REQUIRED_MEMBER_TEC_CREDITS);
              const communityCreditsMet = communityCredits >= REQUIRED_COMMUNITY_CREDITS;

              return (
                <Table.Row>
                  <Table.Cell positive={totalCreditsMet} className={styles.nameCell}>
                    {member.firstName} {member.lastName} ({member.netid})
                  </Table.Cell>
                  <Table.Cell positive={totalCreditsMet}>{totalCredits}</Table.Cell>
                  {COMMUNITY_EVENTS && (
                    <Table.Cell positive={communityCreditsMet}>{communityCredits}</Table.Cell>
                  )}
                  {teamEvents.map((event) => {
                    const numCredits = calculateTotalCreditsForEvent(member, event);
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
