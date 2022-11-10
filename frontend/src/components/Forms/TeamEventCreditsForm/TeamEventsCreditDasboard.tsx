import React, { useEffect, useState } from 'react';
import { Form, Card, Message } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import styles from './TeamEventCreditsForm.module.css';

const REQUIRED_TEC_CREDITS = 3; // number of required tec credits in a semester

const TeamEventCreditDashboard = (): JSX.Element => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  const [approvedTEC, setApprovedTEC] = useState<TeamEventInfo[]>([]);
  const [pendingTEC, setPendingTEC] = useState<TeamEventInfo[]>([]);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEventsForMember().then((val) => {
      setApprovedTEC(val.approved);
      setPendingTEC(val.pending);
    });
  }, []);

  const approvedCredits = approvedTEC.reduce(
    (approved, teamEvent) => approved + Number(teamEvent.numCredits),
    0
  );
  const remainingCredits =
    REQUIRED_TEC_CREDITS - approvedCredits > 0 ? REQUIRED_TEC_CREDITS - approvedCredits : 0;

  return (
    <div>
      <Form>
        <div className={styles.header}></div>
        <h1>Check Team Event Credits</h1>
        <p>
          Check your team event credit status for this semester here! Every DTI member must complete
          {REQUIRED_TEC_CREDITS} team event credits to fulfill this requirement.
        </p>

        <div className={styles.inline}>
          <label className={styles.bold}>
            Your Approved Credits: <span className={styles.dark_grey_color}>{approvedCredits}</span>
          </label>
        </div>

        <div className={styles.inline}>
          <label className={styles.bold}>
            Remaining Credits Needed:{' '}
            <span className={styles.dark_grey_color}>{remainingCredits}</span>
          </label>
        </div>

        <div className={styles.inline}>
          <label className={styles.bold}>Approved Events:</label>
          {approvedTEC.length !== 0 ? (
            <Card.Group>
              {approvedTEC.map((teamEvent) => (
                <Card>
                  <Card.Content>
                    <Card.Header>{teamEvent.name} </Card.Header>
                    <Card.Meta>{teamEvent.date}</Card.Meta>
                    <Card.Meta>{`Number of Credits: ${teamEvent.numCredits}`}</Card.Meta>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <Message>You have not been approved for any team events yet.</Message>
          )}
        </div>

        <div className={styles.inline}>
          <label className={styles.bold}>Pending Approval For:</label>
          {pendingTEC.length !== 0 ? (
            <Card.Group>
              {pendingTEC.map((teamEvent) => (
                <Card>
                  <Card.Content>
                    <Card.Header>{teamEvent.name} </Card.Header>
                    <Card.Meta>{teamEvent.date}</Card.Meta>
                    <Card.Meta>{`Number of Credits: ${teamEvent.numCredits}`}</Card.Meta>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <Message>You are not currently pending approval for any team events.</Message>
          )}
        </div>
      </Form>
    </div>
  );
};

export default TeamEventCreditDashboard;
