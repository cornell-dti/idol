import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button, Icon } from 'semantic-ui-react';
import { ExportToCsv, Options } from 'export-to-csv';
import { ADVISOR_ROLES, LEAD_ROLES } from 'common-types/constants';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import TecConfigAPI from '../../../API/TecConfigAPI';
import { REQUIRED_INITIATIVE_CREDITS, INITIATIVE_EVENTS } from '../../../consts';
import styles from './TeamEventDashboard.module.css';
import NotifyMemberModal from '../../Modals/NotifyMemberModal';
import {
  calculateCredits,
  getTECPeriod,
  getPeriods,
  getRequiredKindCredits,
  withKindCreditDefaults
} from '../../../utils';

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
const getCreditsForKind = (
  member: IdolMember,
  teamEvents: TeamEvent[],
  kind: TeamEventKind
): number =>
  teamEvents
    .filter((event) => event.kind === kind)
    .reduce((val, event) => val + calculateTotalCreditsForEvent(member, event), 0);

const getRemainingCredits = (
  member: IdolMember,
  currentPeriodCredits: number,
  requiredMemberTecCredits: number,
  requiredLeadTecCredits: number
): number =>
  calculateCredits(
    currentPeriodCredits,
    LEAD_ROLES.includes(member.role) ? requiredLeadTecCredits : requiredMemberTecCredits
  );

const getRemainingKindCredits = (
  member: IdolMember,
  periodEvents: TeamEvent[],
  tecConfig: TECConfig
): { internal: number; external: number } => {
  const required = getRequiredKindCredits(member.role, tecConfig);
  return {
    internal: calculateCredits(
      getCreditsForKind(member, periodEvents, 'internal'),
      required.internal
    ),
    external: calculateCredits(
      getCreditsForKind(member, periodEvents, 'external'),
      required.external
    )
  };
};

const isBehindOnCurrentPeriod = (
  member: IdolMember,
  periodEvents: TeamEvent[],
  tecConfig: TECConfig,
  requiredMemberTecCredits: number,
  requiredLeadTecCredits: number
): boolean => {
  if (tecConfig.considerEventKind) {
    const remaining = getRemainingKindCredits(member, periodEvents, tecConfig);
    return remaining.internal > 0 || remaining.external > 0;
  }
  return (
    getRemainingCredits(
      member,
      getTotalCredits(member, periodEvents),
      requiredMemberTecCredits,
      requiredLeadTecCredits
    ) > 0
  );
};

const TeamEventDashboard: React.FC = () => {
  const [teamEvents, setTeamEvents] = useState<TeamEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayPeriod, setDisplayPeriod] = useState<boolean>(false);
  const [tecConfig, setTecConfig] = useState<TECConfig | null>(null);

  const allMembers = useMembers();

  useEffect(() => {
    TeamEventsAPI.getAllTeamEvents().then((events) => {
      setTeamEvents(events);
      setIsLoading(false);
    });
    TecConfigAPI.getTecConfig().then((config) => setTecConfig(withKindCreditDefaults(config)));
  }, []);

  if (isLoading || !tecConfig) return <Loader active>Fetching team event data...</Loader>;

  const tecDeadlines = tecConfig.periodEndDates.map((d) => new Date(d));
  const { requiredMemberTecCredits, requiredLeadTecCredits } = tecConfig;

  const getRequiredCredits = (member: IdolMember): number =>
    LEAD_ROLES.includes(member.role) ? requiredLeadTecCredits : requiredMemberTecCredits;

  const periods = getPeriods(teamEvents, tecDeadlines);

  const currentPeriodIndex = getTECPeriod(new Date(), tecDeadlines);

  const membersNeedingNotification = allMembers.filter((member) => {
    if (ADVISOR_ROLES.includes(member.role)) return false;
    return isBehindOnCurrentPeriod(
      member,
      periods[currentPeriodIndex].events,
      tecConfig,
      requiredMemberTecCredits,
      requiredLeadTecCredits
    );
  });

  const handleExportToCsv = () => {
    const csvData = allMembers.map((member) => {
      const totalCredits = getTotalCredits(member, teamEvents);
      const initiativeCredits = getInitiativeCredits(member, teamEvents);
      const internalCredits = getCreditsForKind(member, teamEvents, 'internal');
      const externalCredits = getCreditsForKind(member, teamEvents, 'external');

      const data = teamEvents.reduce(
        (prev, event) => ({
          ...prev,
          [event.name]: calculateTotalCreditsForEvent(member, event)
        }),
        {
          Name: `${member.firstName} ${member.lastName}`,
          NetID: `${member.netid}`,
          Total: totalCredits,
          ...(tecConfig.considerEventKind
            ? { Internal: internalCredits, External: externalCredits }
            : {}),
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
              {membersNeedingNotification.length > 0 && (
                <NotifyMemberModal
                  all={true}
                  trigger={
                    <Button className={styles.remindButton} size="small" color="orange">
                      Notify Members Behind Current Period
                    </Button>
                  }
                  members={membersNeedingNotification}
                  type={'period'}
                />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {!displayPeriod && 'Total'}
              {displayPeriod &&
                (tecConfig.considerEventKind
                  ? 'Remaining Internal / External'
                  : 'Remaining Period Credits')}
            </Table.HeaderCell>
            {tecConfig.considerEventKind && !displayPeriod && (
              <>
                <Table.HeaderCell>Internal</Table.HeaderCell>
                <Table.HeaderCell>External</Table.HeaderCell>
              </>
            )}
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
                  const internalCredits = getCreditsForKind(member, teamEvents, 'internal');
                  const externalCredits = getCreditsForKind(member, teamEvents, 'external');

                  const isUpToDateForAllPeriods = () =>
                    Array.from({ length: currentPeriodIndex + 1 }, (_, i) => i).every((i) => {
                      if (tecConfig.considerEventKind) {
                        const remaining = getRemainingKindCredits(
                          member,
                          periods[i].events,
                          tecConfig
                        );
                        return remaining.internal <= 0 && remaining.external <= 0;
                      }
                      const periodCredits = getTotalCredits(member, periods[i].events);
                      const requiredCredits = getRequiredCredits(member);
                      return periodCredits >= requiredCredits;
                    });

                  const isUpToDate = isUpToDateForAllPeriods();
                  const initiativeCreditsMet = initiativeCredits >= REQUIRED_INITIATIVE_CREDITS;
                  const currentPeriodEvents = periods[currentPeriodIndex].events;
                  const remainingCredits = getRemainingCredits(
                    member,
                    getTotalCredits(member, currentPeriodEvents),
                    requiredMemberTecCredits,
                    requiredLeadTecCredits
                  );
                  const remainingKindCredits = getRemainingKindCredits(
                    member,
                    currentPeriodEvents,
                    tecConfig
                  );
                  const isBehind = tecConfig.considerEventKind
                    ? remainingKindCredits.internal > 0 || remainingKindCredits.external > 0
                    : remainingCredits > 0;
                  const isAdvisor = ADVISOR_ROLES.includes(member.role);

                  return (
                    <Table.Row>
                      <Table.Cell positive={isUpToDate} className={styles.nameCell}>
                        {member.firstName} {member.lastName} ({member.netid})
                        {isBehind && (
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
                            type={'period'}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell positive={isUpToDate}>{totalCredits}</Table.Cell>
                      {tecConfig.considerEventKind && (
                        <>
                          <Table.Cell>{internalCredits}</Table.Cell>
                          <Table.Cell>{externalCredits}</Table.Cell>
                        </>
                      )}
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
                  const currentPeriodEvents = periods[currentPeriodIndex].events;
                  const remainingCredits = getRemainingCredits(
                    member,
                    getTotalCredits(member, currentPeriodEvents),
                    requiredMemberTecCredits,
                    requiredLeadTecCredits
                  );
                  const remainingKindCredits = getRemainingKindCredits(
                    member,
                    currentPeriodEvents,
                    tecConfig
                  );
                  const isBehind = tecConfig.considerEventKind
                    ? remainingKindCredits.internal > 0 || remainingKindCredits.external > 0
                    : remainingCredits > 0;
                  const isAdvisor = ADVISOR_ROLES.includes(member.role);

                  return (
                    <Table.Row>
                      <Table.Cell positive={!isBehind} className={styles.nameCell}>
                        {member.firstName} {member.lastName} ({member.netid})
                        {isBehind && (
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
                            type={'period'}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell positive={!isBehind}>
                        {tecConfig.considerEventKind
                          ? `${remainingKindCredits.internal} internal, ${remainingKindCredits.external} external`
                          : remainingCredits}
                      </Table.Cell>
                      {periods.map((period) => {
                        if (tecConfig.considerEventKind) {
                          const internalCredits = getCreditsForKind(
                            member,
                            period.events,
                            'internal'
                          );
                          const externalCredits = getCreditsForKind(
                            member,
                            period.events,
                            'external'
                          );
                          return (
                            <Table.Cell className={styles.eventCell}>
                              {internalCredits} int / {externalCredits} ext
                            </Table.Cell>
                          );
                        }
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
