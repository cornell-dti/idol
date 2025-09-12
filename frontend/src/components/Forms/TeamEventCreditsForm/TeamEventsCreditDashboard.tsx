import React, { Dispatch, SetStateAction, useState } from 'react';
import { Card, Loader, Message, Button, Modal, Header, Image } from 'semantic-ui-react';
import { LEAD_ROLES } from 'common-types/constants';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './TeamEventCreditsForm.module.css';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import ImagesAPI from '../../../API/ImagesAPI';
import { Emitters } from '../../../utils';

import {
  REQUIRED_INITIATIVE_CREDITS,
  REQUIRED_LEAD_TEC_CREDITS,
  REQUIRED_MEMBER_TEC_CREDITS,
  INITIATIVE_EVENTS,
  TEC_DEADLINES
} from '../../../consts';

const TeamEventCreditDashboard = (props: {
  allTEC: TeamEventInfo[];
  approvedAttendance: TeamEventAttendance[];
  pendingAttendance: TeamEventAttendance[];
  rejectedAttendance: TeamEventAttendance[];
  isAttendanceLoading: boolean;
  setPendingAttendance: Dispatch<SetStateAction<TeamEventAttendance[]>>;
  requiredPeriodCredits: number;
  tecCounts: number[];
}): JSX.Element => {
  const {
    allTEC,
    approvedAttendance,
    pendingAttendance,
    rejectedAttendance,
    isAttendanceLoading,
    setPendingAttendance,
    requiredPeriodCredits,
    tecCounts
  } = props;
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userRole = useSelf()!.role;

  const getHoursAttended = (attendance: TeamEventAttendance): number => {
    const hours = attendance.hoursAttended;
    if (hours !== undefined) return hours;
    return 1;
  };

  const getTeamEventImage = (attendance: TeamEventAttendance) => {
    setLoading(true);
    ImagesAPI.getImage(attendance.image).then((url: string) => {
      setImage(url);
      setLoading(false);
    });
  };

  const deleteTECAttendanceRequest = (attendance: TeamEventAttendance) => {
    TeamEventsAPI.deleteTeamEventAttendance(attendance.uuid)
      .then(() => {
        setPendingAttendance(
          pendingAttendance.filter((currAttendance) => currAttendance.uuid !== attendance.uuid)
        );
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Deleted!',
          contentMsg: 'Your team event attendance was successfully deleted!'
        });
        ImagesAPI.deleteImage(`${attendance.image}`);
        Emitters.teamEventsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: 'You are not allowed to delete this team event attendance!',
          contentMsg: error
        });
      });
  };

  let approvedCredits = 0;
  let approvedInitiativeCredits = 0;
  approvedAttendance.forEach(async (attendance) => {
    const event = allTEC.find((tec) => tec.uuid === attendance.eventUuid);
    if (event !== undefined) {
      const currCredits = event.hasHours
        ? Number(event.numCredits) * getHoursAttended(attendance)
        : Number(event.numCredits);
      approvedCredits += currCredits;
      approvedInitiativeCredits += event.isInitiativeEvent ? currCredits : 0;
    }
  });

  let headerString;
  if (!LEAD_ROLES.includes(userRole))
    headerString = `Check your team event credit status for this semester here!  
    Every DTI member must complete ${REQUIRED_MEMBER_TEC_CREDITS} team event credit per period${
      INITIATIVE_EVENTS
        ? `, with ${REQUIRED_INITIATIVE_CREDITS} of them being initiative team event credits`
        : ''
    } 
    to fulfill this requirement.`;
  else
    headerString = `Since you are a lead, you must complete ${REQUIRED_LEAD_TEC_CREDITS} total team event 
    credits per period${
      INITIATIVE_EVENTS
        ? `, with ${REQUIRED_INITIATIVE_CREDITS} of them being initiative team event credits`
        : ''
    }.`;

  const TecDetailsDisplay = (props: { attendanceList: TeamEventAttendance[] }): JSX.Element => {
    const { attendanceList } = props;
    return (
      <Card.Group>
        {attendanceList.map((attendance) => {
          const teamEvent = allTEC.find((tec) => tec.uuid === attendance.eventUuid);
          if (teamEvent !== undefined) {
            return (
              <Card key={attendance.uuid}>
                <Card.Content>
                  <Card.Header>{teamEvent.name} </Card.Header>
                  <Card.Meta>{teamEvent.date}</Card.Meta>
                  <Card.Meta>
                    {`Total Credits: ${
                      teamEvent.hasHours
                        ? getHoursAttended(attendance) * Number(teamEvent.numCredits)
                        : teamEvent.numCredits
                    } ${
                      teamEvent.maxCredits === teamEvent.numCredits
                        ? ''
                        : `(${teamEvent.maxCredits} Max)`
                    }`}
                  </Card.Meta>
                  {INITIATIVE_EVENTS && (
                    <Card.Meta>
                      Initiative Event: {teamEvent.isInitiativeEvent ? 'Yes' : 'No'}
                    </Card.Meta>
                  )}
                  {attendance.reason ? <Card.Meta>Reason: {attendance.reason}</Card.Meta> : null}
                  <Card.Meta className={styles.margin_before_button}>
                    {attendance.status === 'pending' && (
                      <div>
                        <Button
                          basic
                          color="red"
                          floated="right"
                          size="small"
                          onClick={() => {
                            deleteTECAttendanceRequest(attendance);
                          }}
                        >
                          Cancel
                        </Button>

                        <Modal
                          closeIcon
                          onClose={() => setOpen(false)}
                          onOpen={() => {
                            getTeamEventImage(attendance);
                            setOpen(true);
                          }}
                          open={open}
                          trigger={
                            <Button basic color="green" floated="left" size="small">
                              Preview
                            </Button>
                          }
                        >
                          <Modal.Header>Team Event Credit Preview</Modal.Header>
                          <Modal.Content className={styles.modalContent} scrolling>
                            <Modal.Description>
                              <Header>
                                {attendance.member.firstName} {attendance.member.lastName}
                              </Header>
                              <p>Team Event: {teamEvent.name}</p>
                              <p>Number of Credits: {teamEvent.numCredits}</p>
                              {teamEvent.hasHours && (
                                <p> Hours Attended: {attendance.hoursAttended}</p>
                              )}
                              {isLoading ? (
                                <Loader className="modalLoader" active inline />
                              ) : (
                                <Image src={image} />
                              )}
                            </Modal.Description>
                          </Modal.Content>
                        </Modal>
                      </div>
                    )}
                  </Card.Meta>
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

      {isAttendanceLoading ? (
        <Loader active inline />
      ) : (
        <div>
          <div className={styles.inline}>
            <label className={styles.bold}>Approved Credits per Period:</label>
            <ul>
              {TEC_DEADLINES.map((deadline, index) => (
                <li key={index}>
                  Period {index + 1} (Ends: {deadline.toDateString()}):
                  <span className={styles.dark_grey_color}> {tecCounts[index]}</span>
                </li>
              ))}
            </ul>
          </div>

          {INITIATIVE_EVENTS && (
            <div className={styles.inline}>
              <label className={styles.bold}>
                Your Approved Initiative Credits:{' '}
                <span className={styles.dark_grey_color}>{approvedInitiativeCredits}</span>
              </label>
            </div>
          )}

          <div className={styles.inline}>
            <label className={styles.bold}>
              Remaining Credits Needed for Current Period:{' '}
              <span className={styles.dark_grey_color}>{requiredPeriodCredits}</span>
            </label>
          </div>

          {INITIATIVE_EVENTS && (
            <div className={styles.inline}>
              <label className={styles.bold}>
                Remaining Initiative Credits Needed:{' '}
                <span className={styles.dark_grey_color}>
                  {Math.max(0, REQUIRED_INITIATIVE_CREDITS - approvedInitiativeCredits)}
                </span>
              </label>
            </div>
          )}

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

          <div className={styles.inline}>
            <label className={styles.bold}>Rejected Events:</label>
            {rejectedAttendance.length !== 0 ? (
              <TecDetailsDisplay attendanceList={rejectedAttendance} />
            ) : (
              <Message>You have not been rejected for any team events.</Message>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamEventCreditDashboard;
