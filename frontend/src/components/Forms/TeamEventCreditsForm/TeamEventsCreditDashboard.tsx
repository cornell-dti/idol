import React from 'react';
import { Card, Message } from 'semantic-ui-react';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './TeamEventCreditsForm.module.css';
import {
  REQUIRED_COMMUNITY_CREDITS,
  REQUIRED_LEAD_TEC_CREDITS,
  REQUIRED_MEMBER_TEC_CREDITS
} from '../../../consts';

const TeamEventCreditDashboard = (props: {
  allTEC: TeamEventInfo[];
  approvedAttendance: TeamEventAttendance[];
  pendingAttendance: TeamEventAttendance[];
}): JSX.Element => {
  const { allTEC, approvedAttendance, pendingAttendance } = props;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userRole = useSelf()!.role;

  const requiredCredits =
    userRole === 'lead' ? REQUIRED_LEAD_TEC_CREDITS : REQUIRED_MEMBER_TEC_CREDITS; // number of required tec credits in a semester based on user role

  const getHoursAttended = (attendance: TeamEventAttendance): number => {
    const hours = attendance.hoursAttended;
    if (hours !== undefined) return hours;
    return 1;
  };

  let approvedCredits = 0;
  let approvedCommunityCredits = 0;
  approvedAttendance.forEach(async (attendance) => {
    const event = allTEC.find((tec) => tec.uuid === attendance.eventUuid);
    if (event !== undefined) {
      const currCredits = event.hasHours
        ? Number(event.numCredits) * getHoursAttended(attendance)
        : Number(event.numCredits);
      approvedCredits += currCredits;
      approvedCommunityCredits += event.isCommunity ? currCredits : 0;
    }
  });

  // Calculate the remaining credits
  let remainingCredits;
  if (requiredCredits - approvedCredits > 0) remainingCredits = requiredCredits - approvedCredits;
  else if (approvedCommunityCredits < REQUIRED_COMMUNITY_CREDITS)
    remainingCredits = REQUIRED_COMMUNITY_CREDITS - approvedCommunityCredits;
  else remainingCredits = 0;

  // remove this variable and usage when community events ready to be released
  const COMMUNITY_EVENTS = false;

  let headerString;
  if (userRole !== 'lead')
    headerString = `Check your team event credit status for this semester here!  
    Every DTI member must complete ${REQUIRED_MEMBER_TEC_CREDITS} team event credits 
    ${COMMUNITY_EVENTS ? `and ${REQUIRED_COMMUNITY_CREDITS} community team event credits` : ''} 
    to fulfill this requirement.`;
  else
    headerString = `Since you are a lead, you must complete ${REQUIRED_LEAD_TEC_CREDITS} total team event credits
    ${
      COMMUNITY_EVENTS
        ? `, with ${REQUIRED_COMMUNITY_CREDITS} of them being community event credits`
        : ''
    }.`;

  const TecDetailsDisplay = (props: { attendanceList: TeamEventAttendance[] }): JSX.Element => {
    const { attendanceList } = props;
    return (
      <Card.Group>
        {attendanceList.map((attendance, i) => {
          const teamEvent = allTEC.find((tec) => tec.uuid === attendance.eventUuid);
          if (teamEvent !== undefined) {
            return (
              <Card key={i}>
                <Card.Content>
                  <Card.Header>{teamEvent.name} </Card.Header>
                  <Card.Meta>{teamEvent.date}</Card.Meta>
                  <Card.Meta>
                    {`Total Credits: ${
                      teamEvent.hasHours
                        ? getHoursAttended(attendance) * Number(teamEvent.numCredits)
                        : teamEvent.numCredits
                    }`}
                  </Card.Meta>
                  {COMMUNITY_EVENTS && (
                    <Card.Meta>Community Event: {teamEvent.isCommunity ? 'Yes' : 'No'}</Card.Meta>
                  )}
                </Card.Content>
              </Card>
            );
          }
          return (
            <Message>
              The team event for attendance {attendance.uuid} cannot be found. Contact
              #idol-support.
            </Message>
          );
        })}
      </Card.Group>
    );
  };

  return (
    <div>
      <div className={styles.header}></div>
      <h1>Check Team Event Credits</h1>
      <p>{headerString}</p>

      <div className={styles.inline}>
        <label className={styles.bold}>
          Your Approved Credits: <span className={styles.dark_grey_color}>{approvedCredits}</span>
        </label>
      </div>

      {COMMUNITY_EVENTS && (
        <div className={styles.inline}>
          <label className={styles.bold}>
            Your Approved Community Credits:{' '}
            <span className={styles.dark_grey_color}>{approvedCommunityCredits}</span>
          </label>
        </div>
      )}

      <div className={styles.inline}>
        <label className={styles.bold}>
          Remaining Credits Needed:{' '}
          <span className={styles.dark_grey_color}>{remainingCredits}</span>
        </label>
      </div>

      <div className={styles.inline}>
        <label className={styles.bold}>Approved Events:</label>
        {approvedAttendance.length !== 0 ? (
          <TecDetailsDisplay attendanceList={approvedAttendance} />
        ) : (
          <Message>You have not been approved for any team events yet.</Message>
        )}
      </div>

      <div className={styles.inline}>
        <label className={styles.bold}>Pending Approval For:</label>
        {pendingAttendance.length !== 0 ? (
          <TecDetailsDisplay attendanceList={pendingAttendance} />
        ) : (
          <Message>You are not currently pending approval for any team events.</Message>
        )}
      </div>
    </div>
  );
};

export default TeamEventCreditDashboard;
