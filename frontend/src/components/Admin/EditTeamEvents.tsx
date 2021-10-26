import React, { useState } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import { Emitters } from '../../utils';
import { Member } from '../../API/MembersAPI';

// put type in TeamEventsAPI, not created yet
type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: Member[];
  membersApproved: Member[];
};

const EditTeamEvents: React.FC = () => {
  const [teamEventName, setTeamEventName] = useState('');
  const [teamEventDate, setTeamEventDate] = useState('');
  const [teamEventCreditNum, setTeamEventCreditNum] = useState('');
  const [teamEventHasHours, setTeamEventHasHours] = useState(false);

  const createTeamEvent = (teamEvent: TeamEvent) => {
    // send new event to backend
  };

  // need to fix custom modals with built in messages
  const submitTeamEvent = () => {
    if (!teamEventName) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Name',
        contentMsg: 'Please enter the name of the team event!'
      });
    } else if (!teamEventDate) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Date',
        contentMsg: 'Please enter the date of the team event!'
      });
    } else if (
      !teamEventCreditNum ||
      teamEventCreditNum === '' ||
      isNaN(Number(teamEventCreditNum)) ||
      Number(teamEventCreditNum) < 1
    ) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Credit Amount',
        contentMsg: 'Please enter how many credits the event is worth!'
      });
    } else {
      const newTeamEvent: TeamEvent = {
        name: teamEventName,
        date: teamEventDate,
        numCredits: teamEventCreditNum,
        hasHours: teamEventHasHours,
        membersPending: [],
        membersApproved: []
      };
      createTeamEvent(newTeamEvent);
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Created!',
        contentMsg: 'The team event was successfully created!'
      });
    }
  };

  return (
    <div>
      <Form
        style={{
          width: '60%',
          alignSelf: 'center',
          margin: 'auto',
          padding: '3rem 0 5rem 0'
        }}
      >
        <h1>Create a Team Event</h1>
        <Form.Input
          value={teamEventName}
          onChange={(event) => setTeamEventName(event.target.value)}
          label={
            <label style={{ fontWeight: 'bold' }}>
              Event Name: <span style={{ color: '#db2828' }}>*</span>
            </label>
          }
        ></Form.Input>

        <Form.Input
          value={teamEventDate}
          onChange={(event) => {
            setTeamEventDate(event.target.value);
          }}
          type="date"
          label={
            <label style={{ fontWeight: 'bold' }}>
              Event Date: <span style={{ color: '#db2828' }}>*</span>
            </label>
          }
        ></Form.Input>

        <Form.Input
          value={teamEventCreditNum}
          onChange={(event) => {
            setTeamEventCreditNum(event.target.value);
          }}
          type="number"
          label={
            <label style={{ fontWeight: 'bold' }}>
              How many credits is this event worth? <span style={{ color: '#db2828' }}>*</span>
            </label>
          }
        ></Form.Input>

        <label htmlFor="radioGroup" style={{ fontWeight: 'bold' }}>
          Does this event have hours? <span style={{ color: '#db2828' }}>*</span>
        </label>
        <Form.Field>
          <Radio
            label="Yes"
            name="radioGroup"
            value="Yes"
            checked={teamEventHasHours}
            onChange={() => setTeamEventHasHours(true)}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="No"
            name="radioGroup"
            value="No"
            checked={!teamEventHasHours}
            onChange={() => setTeamEventHasHours(false)}
          />
        </Form.Field>

        <Form.Button floated="right" onClick={submitTeamEvent}>
          Create Event
        </Form.Button>
      </Form>
    </div>
  );
};

export default EditTeamEvents;
