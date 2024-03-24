import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button, Icon, Checkbox } from 'semantic-ui-react';
import { ExportToCsv, Options } from 'export-to-csv';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import {
  REQUIRED_LEAD_TEC_CREDITS,
  REQUIRED_MEMBER_TEC_CREDITS,
  REQUIRED_INITIATIVE_CREDITS,
  INITIATIVE_EVENTS
} from '../../../consts';
import styles from './TeamEventDashboard.module.css';
import NotifyMemberModal from '../../Modals/NotifyMemberModal';

const calculateMemberCreditsForEvent = (
  member: IdolMember,
  event: TeamEvent,
  isInitiativeEvent: boolean
): number =>
  isInitiativeEvent && !event.isInitiativeEvent
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

const calculateInitiativeCreditsForEvent = (member: IdolMember, event: TeamEvent): number =>
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

  const handleExportToCsv = () => {
    const csvData = allMembers.map((member) => {
      const totalCredits = teamEvents.reduce(
        (val, event) => val + calculateTotalCreditsForEvent(member, event),
        0
      );
      const initiativeCredits = teamEvents.reduce(
        (val, event) => val + calculateInitiativeCreditsForEvent(member, event),
        0
      );

      const data = teamEvents.reduce(
        (prev, event) => ({
          ...prev,
          [event.name]: calculateTotalCreditsForEvent(member, event)
        }),
        {
          Name: `${member.firstName} ${member.lastName}`,
          NetID: `${member.netid}`,
          Total: totalCredits,
          Initiative: initiativeCredits
        }
      );

      return data;
    });

    const options: Options = {
      filename: `TEC_Dashboard`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `TEC Dashboard`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(csvData);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerContainer}>
        <Header as="h1">Team Event Dashboard</Header>
        <div className={styles.csvButton}>
          <Button onClick={() => handleExportToCsv()}>Export to CSV</Button>
        </div>
      </div>
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
                label={{ children: 'End of Semester Reminder?' }}
                checked={endOfSemesterReminder}
                onChange={() =>
                  setEndOfSemesterReminder((endOfSemesterReminder) => !endOfSemesterReminder)
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            {INITIATIVE_EVENTS && <Table.HeaderCell>Total Initiative Credits</Table.HeaderCell>}
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
              const initiativeCredits = teamEvents.reduce(
                (val, event) => val + calculateInitiativeCreditsForEvent(member, event),
                0
              );
              const totalCreditsMet =
                totalCredits >=
                (member.role === 'lead' ? REQUIRED_LEAD_TEC_CREDITS : REQUIRED_MEMBER_TEC_CREDITS);
              const initiativeCreditsMet = initiativeCredits >= REQUIRED_INITIATIVE_CREDITS;

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
                  {INITIATIVE_EVENTS && (
                    <Table.Cell positive={initiativeCreditsMet}>{initiativeCredits}</Table.Cell>
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
