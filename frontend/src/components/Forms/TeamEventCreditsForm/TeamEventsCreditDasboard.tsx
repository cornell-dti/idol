import React from 'react';
import { Form, Card, Message } from 'semantic-ui-react';
import styles from './TeamEventCreditsForm.module.css';

const REQUIRED_COMMUNITY_CREDITS = 1;

const TeamEventCreditDashboard = (props: {
  approvedTEC: TeamEventInfo[];
  pendingTEC: TeamEventInfo[];
  userRole: Role;
}): JSX.Element => {
  const { approvedTEC, pendingTEC, userRole } = props;

  const REQUIRED_TEC_CREDITS = userRole === 'lead' ? 6 : 3; // number of required tec credits in a semester based on user role

  const approvedCredits = approvedTEC.reduce(
    (approved, teamEvent) => approved + Number(teamEvent.numCredits),
    0
  );
  const approvedCommunityCredits = approvedTEC.reduce(
    (communityCredits, teamEvent) =>
      teamEvent.isCommunity ? communityCredits + Number(teamEvent.numCredits) : communityCredits,
    0
  );

  // Calculate the remaining credits
  let remainingCredits;
  if (REQUIRED_TEC_CREDITS - approvedCredits > 0)
    remainingCredits = REQUIRED_TEC_CREDITS - approvedCredits;
  else if (approvedCommunityCredits < REQUIRED_COMMUNITY_CREDITS)
    remainingCredits = REQUIRED_COMMUNITY_CREDITS - approvedCommunityCredits;
  else remainingCredits = 0;

  let headerString;
  if (userRole !== 'lead')
    headerString = `Check your team event credit status for this semester here! Every DTI member must complete ${REQUIRED_TEC_CREDITS} team event credits and ${REQUIRED_COMMUNITY_CREDITS} community team event credits to fulfill this requirement.`;
  else
    headerString =
      'Since you are a lead, you must complete 6 total team event credits, with 1 of them being community event credits.';

  return (
    <div>
      <Form>
        <div className={styles.header}></div>
        <h1>Check Team Event Credits</h1>
        <p>{headerString}</p>

        <div className={styles.inline}>
          <label className={styles.bold}>
            Your Approved Credits: <span className={styles.dark_grey_color}>{approvedCredits}</span>
          </label>
        </div>

        <div className={styles.inline}>
          <label className={styles.bold}>
            Your Approved Community Credits:{' '}
            <span className={styles.dark_grey_color}>{approvedCommunityCredits}</span>
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
                    <Card.Meta>Community Event: {teamEvent.isCommunity ? 'Yes' : 'No'}</Card.Meta>
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
