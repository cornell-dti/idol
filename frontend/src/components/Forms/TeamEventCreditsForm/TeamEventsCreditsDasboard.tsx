import React, { useEffect, useState } from 'react';
import { Form, Card, Message } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';

const TeamEventCreditDashboard = (props: { userInfo: IdolMember }): JSX.Element => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { userInfo } = props;

  const [teamEvents, setTeamEvents] = useState<TeamEvent[]>([]);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEvents().then((teamEvents) => setTeamEvents(teamEvents));
  }, []);

  const [countApprovedCredits, setCountApprovedCredits] = useState(0);
  const [countRemainingCredits, setCountRemainingCredits] = useState(3);
  const [approvedTEC, setApprovedTEC] = useState<TeamEvent[]>([]);
  const [pendingTEC, setPendingTEC] = useState<TeamEvent[]>([]);

  useEffect(() => {
    if (teamEvents != null) {
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
    }
  }, [teamEvents]);

  return (
    <div>
      <Form>
        <div style={{ margin: '8rem 0' }}></div>
        <h1>Check Team Event Credits</h1>
        <p>
          Check your team event credit status for this semester here! Every DTI member must complete
          3 team event credits to fulfill this requirement.
        </p>

        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>Approved Credits:</label>
          <p>{countApprovedCredits}</p>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>Approved Events:</label>
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

        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>Remaining Credits Needed:</label>
          <p>{countRemainingCredits}</p>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>Pending Approval For:</label>
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
