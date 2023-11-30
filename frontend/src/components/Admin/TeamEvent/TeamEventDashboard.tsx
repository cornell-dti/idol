import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button, Icon, Checkbox } from 'semantic-ui-react';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import {
  REQUIRED_LEAD_TEC_CREDITS,
  REQUIRED_MEMBER_TEC_CREDITS,
  REQUIRED_COMMUNITY_CREDITS
} from '../../../consts';
import styles from './TeamEventDashboard.module.css';
import NotifyMemberModal from '../../Modals/NotifyMemberModal';

// remove this and its usage if/when community events are released
const COMMUNITY_EVENTS = false;

const calculateMemberCreditsForEvent = (
  member: IdolMember,
  event: TeamEvent,
  isCommunity: boolean
): number =>
  isCommunity && !event.isCommunity
    ? 0
    : event.requests
        .filter((req) => req.status === 'approved')
        .reduce((val: number, attendee) => {
          if (attendee.member.email !== member.email) {
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
  const [endOfSemesterReminder, setEndOfSemesterReminder] = useState(false);

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
        <Table celled selectable striped className={styles.dashboardTable}>
          <Table.Header>
            <Table.HeaderCell className={styles.nameCell}>
              Name
              <NotifyMemberModal
                all={true}
                trigger={
                  <Button className={styles.remindButton} size="small" color="red">
                    Remind All
                  </Button>
                }
                members={allMembers.filter((member) => {
                  const totalCredits = teamEvents.reduce(
                    (val, event) => val + calculateTotalCreditsForEvent(member, event),
                    0
                  );
                  return (
                    totalCredits <
                    (member.role === 'lead'
                      ? REQUIRED_LEAD_TEC_CREDITS
                      : REQUIRED_MEMBER_TEC_CREDITS)
                  );
                })}
                endOfSemesterReminder={endOfSemesterReminder}
              />
              <Checkbox
                className={styles.endOfSemesterCheckbox}
                label={{ children: 'End of Semester?' }}
                checked={endOfSemesterReminder}
                onChange={() =>
                  setEndOfSemesterReminder((endOfSemesterReminder) => !endOfSemesterReminder)
                }
              />
            </Table.HeaderCell>
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
                    {!totalCreditsMet && (
                      <NotifyMemberModal
                        all={false}
                        trigger={<Icon className={styles.notify} name="exclamation" color="red" />}
                        member={member}
                        endOfSemesterReminder={endOfSemesterReminder}
                      />
                    )}
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
