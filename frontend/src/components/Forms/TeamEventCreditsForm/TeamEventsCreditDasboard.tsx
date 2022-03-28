import React, { useEffect, useState } from 'react';
import { Form, Card, Message } from 'semantic-ui-react';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './TeamEventCreditsForm.module.css';

const TeamEventCreditDashboard = (props: { teamEvents: TeamEvent[] }): JSX.Element => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  const { teamEvents } = props;

  const [countApprovedCredits, setCountApprovedCredits] = useState(0);
  const [countRemainingCredits, setCountRemainingCredits] = useState(3);
  const [approvedTEC, setApprovedTEC] = useState<TeamEvent[]>([]);
  const [pendingTEC, setPendingTEC] = useState<TeamEvent[]>([]);

  useEffect(() => {
    teamEvents.forEach((currTeamEvent) => {
      currTeamEvent.attendees.forEach((currApprovedMember) => {
        if (currApprovedMember.member.email === userInfo.email) {
          const currCredits = Number(currTeamEvent.numCredits);
          setCountApprovedCredits((countApprovedCredits) => countApprovedCredits + currCredits);
          setCountRemainingCredits((countRemainingCredits) => {
            if (countRemainingCredits - currCredits <= 0) return 0;
            return countRemainingCredits - currCredits;
          });
          setApprovedTEC((approvedTEC) => [...approvedTEC, currTeamEvent]);
        }
      });
      currTeamEvent.requests.forEach((currApprovedMember) => {
        if (currApprovedMember.member.email === userInfo.email) {
          setPendingTEC((pendingTEC) => [...pendingTEC, currTeamEvent]);
        }
      });
    });
  }, [teamEvents]);

  return (
    <div>
      <Form>
        <div className={styles.header}></div>
        <h1>Check Team Event Credits</h1>
        <p>
          Check your team event credit status for this semester here! Every DTI member must complete
          3 team event credits to fulfill this requirement.
        </p>

        <div className={styles.inline}>
          <label className={styles.bold}>Approved Credits:</label>
          <p>{countApprovedCredits}</p>
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
          <label className={styles.bold}>Remaining Credits Needed:</label>
          <p>{countRemainingCredits}</p>
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
