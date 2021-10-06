import React, { useState, useEffect } from 'react';
import { Form, Radio, Segment, Label, Button } from 'semantic-ui-react';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { useUserEmail } from '../../Common/UserProvider';
import { Emitters } from '../../../utils';
import CustomSearch from '../../Common/Search';

type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  membersPending: Member[];
  membersApproved: Member[];
};

type TeamEventAttendace = {
  memberEmail: string;
  teamEventName: string;
  image: string;
};

const TeamEventsCreditForm: React.FC = () => {
  const userEmail = useUserEmail();
  const getUser = async (email: string): Promise<Member> => MembersAPI.getMember(email);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [teamEvent, setTeamEvent] = useState<TeamEvent | undefined>(undefined);
  const [numCredits, setNumCredits] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail)
        .then((mem) => {
          setName(`${mem.firstName} ${mem.lastName}`);
          setRole(mem.role);
        })
        .catch((error) => {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get member!",
            contentMsg: `Error was: ${error}`
          });
        });
    }
  }, [userEmail]);

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
  };

  const requestTeamEventCredit = (eventCreditRequest: TeamEventAttendace) => {
    // add user to pending list of the team event
    // notify leads of request
  };

  const submitTeamEventCredit = () => {
    if (!teamEvent) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Selected',
        contentMsg: 'Please select a team event!'
      });
    } else if (!image) {
      Emitters.generalError.emit({
        headerMsg: 'No Image Uploaded',
        contentMsg: 'Please upload an image!'
      });
    } else {
      const newTeamEventAttendance: TeamEventAttendace = {
        memberEmail: userEmail,
        teamEventName: teamEvent.name,
        image
      };
      requestTeamEventCredit(newTeamEventAttendance);
    }
  };

  const teamEvents: TeamEvent[] = [
    {
      name: 'Coffee Chat',
      date: 'Sept 3',
      numCredits: '0.5',
      membersPending: [],
      membersApproved: []
    }
  ];

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
        <h1>DTI Team Event Credits</h1>
        <p>
          Earn team event credits for participating in DTI events! Fill out this form every time and
          attach a picture of yourself at the event to receive credit.
        </p>
        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>Name:</label>
          <p>{name}</p>
        </div>

        <label htmlFor="roleRadioGroup" style={{ fontWeight: 'bold' }}>
          Role:
        </label>
        <Form.Field>
          <Radio
            label="Dev"
            name="roleRadioGroup"
            value="dev"
            checked={role === 'developer'}
            style={{ marginTop: '1rem' }}
            readOnly
            disabled
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="Design"
            name="roleRadioGroup"
            value="design"
            checked={role === 'Designer'}
            readOnly
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="Business"
            name="roleRadioGroup"
            value="business"
            checked={role === 'business'}
            readOnly
          />
        </Form.Field>
        <Form.Field>
          <Radio label="PM" name="roleRadioGroup" value="pm" checked={role === 'pm'} readOnly />
        </Form.Field>
        <Form.Field>
          <Radio label="TPM" name="roleRadioGroup" value="tpm" checked={role === 'tpm'} readOnly />
        </Form.Field>

        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>
            Select a Team Event: <span style={{ color: '#db2828' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {teamEvents && !teamEvent ? (
              <CustomSearch
                source={teamEvents}
                resultRenderer={(event) => (
                  <Segment>
                    <h4>{event.name}</h4>
                    <Label>{`${event.numCredits} credit(s)`}</Label>
                  </Segment>
                )}
                matchChecker={(query: string, teamEvent: TeamEvent) => {
                  const queryLower = query.toLowerCase();
                  return teamEvent.name.toLowerCase().startsWith(queryLower);
                }}
                selectCallback={(event: TeamEvent) => {
                  setTeamEvent(event);
                }}
              ></CustomSearch>
            ) : undefined}

            {teamEvent ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline'
                }}
              >
                <p style={{ paddingRight: '1.5em' }}>{teamEvent?.name}</p>
                <Button
                  negative
                  onClick={() => {
                    setTeamEvent(undefined);
                  }}
                >
                  Clear
                </Button>
              </div>
            ) : undefined}
          </div>
        </div>

        <label style={{ fontWeight: 'bold' }}>
          How many event credit(s)? <span style={{ color: '#db2828' }}>*</span>
        </label>
        <Form.Input
          fluid
          type="number"
          step="0.5"
          size="large"
          value={numCredits}
          onChange={(event) => setNumCredits(event.target.value)}
          style={{ width: '20%' }}
          required
        />
        <div style={{ margin: '2rem 0' }}>
          <p style={{ marginBottom: '0' }}>
            Please include a picture of yourself (and others) and/or an email chain only if the
            former is not possible.
          </p>
          <label htmlFor="newImage" style={{ fontWeight: 'bold' }}>
            Add File: <span style={{ color: '#db2828' }}>*</span>
          </label>
          <input
            id="newImage"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleNewImage}
          />
        </div>
        <Form.Button floated="right" onClick={submitTeamEventCredit}>
          Submit
        </Form.Button>
      </Form>
    </div>
  );
};

export default TeamEventsCreditForm;
