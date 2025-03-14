import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button, Icon, Checkbox } from 'semantic-ui-react';
import { ExportToCsv, Options } from 'export-to-csv';
import { ADVISOR_ROLES, LEAD_ROLES } from 'common-types/constants';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import {
  REQUIRED_LEAD_TEC_CREDITS,
  REQUIRED_MEMBER_TEC_CREDITS,
  REQUIRED_INITIATIVE_CREDITS,
  INITIATIVE_EVENTS,
  TEC_DEADLINES
} from '../../../consts';
import styles from './TeamEventDashboard.module.css';
import NotifyMemberModal from '../../Modals/NotifyMemberModal';

interface Period {
  name: string;
  start: Date;
  deadline: Date;
  events: TeamEvent[];
}
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

const getTotalCredits = (member: IdolMember, teamEvents: TeamEvent[]): number =>
  teamEvents.reduce((val, event) => val + calculateTotalCreditsForEvent(member, event), 0);
const getInitiativeCredits = (member: IdolMember, teamEvents: TeamEvent[]): number =>
  teamEvents.reduce((val, event) => val + calculateInitiativeCreditsForEvent(member, event), 0);

const TeamEventDashboard: React.FC = () => {
  const [teamEvents, setTeamEvents] = useState<TeamEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayPeriod, setDisplayPeriod] = useState<boolean>(false);
  const [endOfSemesterReminder, setEndOfSemesterReminder] = useState(false);

  const allMembers = useMembers();

  useEffect(() => {
    TeamEventsAPI.getAllTeamEvents().then((events) => {
      setTeamEvents(events);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loader active>Fetching team event data...</Loader>;

  const getFirstPeriodStart = (): Date => {
    const today = new Date();
    const year = today.getFullYear();

    return today.getMonth() < 7 ? new Date(year, 0, 1) : new Date(year, 7, 1);
  };

  const getPeriodIndex = (date: Date): number => {
    for (let i = 0; i < TEC_DEADLINES.length; i += 1) {
      if (date <= TEC_DEADLINES[i]) {
        return i;
      }
    }
    return TEC_DEADLINES.length - 1;
  };

  const getPeriods = () => {
    const periods: Period[] = [];
    let i = 0;
    TEC_DEADLINES.forEach((date) => {
      i += 1;
      const periodIndex = getPeriodIndex(new Date(date.getTime() - 24 * 60 * 60 * 1000));
      const periodStart =
        periodIndex === 0 ? getFirstPeriodStart() : TEC_DEADLINES[periodIndex - 1];
      const periodEnd = TEC_DEADLINES[periodIndex];
      const events = teamEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate > periodStart && eventDate <= periodEnd;
      });
      periods.push({ name: `Period ${i}`, start: periodStart, deadline: date, events });
    });
    return periods;
  };

  const periods = getPeriods();
  const getCreditsPerPeriod = (member: IdolMember) => {
    const credPerPeriod: number[] = [];
    periods.forEach((period: Period) => {
      credPerPeriod.push(getTotalCredits(member, period.events));
    });
    return credPerPeriod;
  };

  const getTECPeriod = (submissionDate: Date) => {
    const currentPeriodIndex = TEC_DEADLINES.findIndex((date) => submissionDate <= date);
    if (currentPeriodIndex === -1) {
      return TEC_DEADLINES.length;
    }
    return currentPeriodIndex;
  };

  const calculateCredits = (prevCredits: number | null, currentCredits: number) => {
    if (prevCredits === null) {
      return currentCredits < 1 ? 1 - currentCredits : 0;
    }
    if (prevCredits < 1) {
      return currentCredits + prevCredits < 2 ? 2 - prevCredits - currentCredits : 0;
    }

    return currentCredits < 1 ? 1 - currentCredits : 0;
  };

  const currentPeriodIndex = getTECPeriod(new Date());
  const membersNeedingNotification = displayPeriod
    ? allMembers.filter((member) => {
        const currentPeriodCredits = getTotalCredits(member, periods[currentPeriodIndex].events);
        const requiredCredits = LEAD_ROLES.includes(member.role)
          ? REQUIRED_LEAD_TEC_CREDITS
          : calculateCredits(null, currentPeriodCredits);

        return currentPeriodCredits < requiredCredits;
      })
    : [];

  const handleExportToCsv = () => {
    const csvData = allMembers.map((member) => {
      const totalCredits = getTotalCredits(member, teamEvents);
      const initiativeCredits = getInitiativeCredits(member, teamEvents);

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
          <div className={styles.displayPeriod}>
            <Button onClick={() => setDisplayPeriod((prev) => !prev)}>
              {!displayPeriod ? 'Display TEC by Period' : 'Return to Dashboard'}
            </Button>
          </div>
          <div className={styles.csvButton}>
            <Button onClick={handleExportToCsv}>Export to CSV</Button>
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <Table celled selectable striped className={styles.dashboardTable}>
          <Table.Header>
            <Table.HeaderCell className={styles.nameCell}>
              Name
              {displayPeriod && membersNeedingNotification.length > 0 ? (
                <NotifyMemberModal
                  all={true}
                  trigger={
                    <Button className={styles.remindButton} size="small" color="orange">
                      Notify Members Below Required Period Credits
                    </Button>
                  }
                  members={membersNeedingNotification}
                  endOfSemesterReminder={endOfSemesterReminder}
                  type={'tec'}
                />
              ) : (
                <NotifyMemberModal
                  all={true}
                  trigger={
                    <Button className={styles.remindButton} size="small" color="red">
                      Remind All (Excludes Advisors)
                    </Button>
                  }
                  members={allMembers.filter((member) => {
                    if (ADVISOR_ROLES.includes(member.role)) return false;
                    const totalCredits = teamEvents.reduce(
                      (val, event) => val + calculateTotalCreditsForEvent(member, event),
                      0
                    );
                    return (
                      totalCredits <
                      (LEAD_ROLES.includes(member.role)
                        ? REQUIRED_LEAD_TEC_CREDITS
                        : REQUIRED_MEMBER_TEC_CREDITS)
                    );
                  })}
                  endOfSemesterReminder={endOfSemesterReminder}
                  type={'tec'}
                />
              )}
              <Checkbox
                className={styles.endOfSemesterCheckbox}
                label={{ children: 'End of Semester Reminder?' }}
                checked={endOfSemesterReminder}
                onChange={() =>
                  setEndOfSemesterReminder((endOfSemesterReminder) => !endOfSemesterReminder)
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell>{!displayPeriod ? 'Total' : 'Required Credits'}</Table.HeaderCell>
            {INITIATIVE_EVENTS && <Table.HeaderCell>Total Initiative Credits</Table.HeaderCell>}
            {!displayPeriod
              ? teamEvents.map((event) => <Table.HeaderCell>{event.name}</Table.HeaderCell>)
              : periods.map((period) => <Table.HeaderCell>{period.name}</Table.HeaderCell>)}
          </Table.Header>
          <Table.Body>
            {!displayPeriod
              ? allMembers.map((member) => {
                  const totalCredits = getTotalCredits(member, teamEvents);
                  const initiativeCredits = getInitiativeCredits(member, teamEvents);
                  const totalCreditsMet =
                    totalCredits >=
                    (LEAD_ROLES.includes(member.role)
                      ? REQUIRED_LEAD_TEC_CREDITS
                      : REQUIRED_MEMBER_TEC_CREDITS);
                  const initiativeCreditsMet = initiativeCredits >= REQUIRED_INITIATIVE_CREDITS;

                  const isAdvisor = ADVISOR_ROLES.includes(member.role);

                  return (
                    <Table.Row>
                      <Table.Cell positive={totalCreditsMet} className={styles.nameCell}>
                        {member.firstName} {member.lastName} ({member.netid})
                        {!totalCreditsMet && (
                          <NotifyMemberModal
                            all={false}
                            trigger={
                              isAdvisor ? (
                                <div />
                              ) : (
                                <Icon className={styles.notify} name="exclamation" color="red" />
                              )
                            }
                            member={member}
                            endOfSemesterReminder={endOfSemesterReminder}
                            type={'tec'}
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
                })
              : allMembers.map((member) => {
                  const currentPeriodIndex = getTECPeriod(new Date());
                  const currentPeriodCredits = getTotalCredits(
                    member,
                    periods[currentPeriodIndex].events
                  );
                  const creditsPerPeriod = getCreditsPerPeriod(member);

                  const previousPeriodIndex =
                    currentPeriodIndex > 0 ? currentPeriodIndex - 1 : null;
                  const previousPeriodCredits =
                    previousPeriodIndex !== null ? creditsPerPeriod[previousPeriodIndex] : null;
                  const requiredCredits = calculateCredits(
                    previousPeriodCredits,
                    currentPeriodCredits
                  );

                  const isAdvisor = ADVISOR_ROLES.includes(member.role);

                  return (
                    <Table.Row>
                      <Table.Cell positive={requiredCredits <= 0} className={styles.nameCell}>
                        {member.firstName} {member.lastName} ({member.netid})
                        {requiredCredits > 0 && (
                          <NotifyMemberModal
                            all={false}
                            trigger={
                              isAdvisor ? (
                                <div />
                              ) : (
                                <Icon className={styles.notify} name="exclamation" color="red" />
                              )
                            }
                            member={member}
                            endOfSemesterReminder={endOfSemesterReminder}
                            type={'tec'}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell positive={requiredCredits <= 0}>{requiredCredits}</Table.Cell>
                      {periods.map((period) => {
                        const numCredits = period.events
                          .map((event) => calculateTotalCreditsForEvent(member, event))
                          .filter((credits) => credits != null)
                          .reduce((sum, credits) => sum + credits, 0);

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
