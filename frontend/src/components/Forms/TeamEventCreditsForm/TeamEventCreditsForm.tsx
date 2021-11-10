import React, { useState, useEffect } from 'react';
import { Form, Segment, Label, Button } from 'semantic-ui-react';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { useUserEmail } from '../../Common/UserProvider';
import { Emitters } from '../../../utils';
import CustomSearch from '../../Common/Search';

type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: Member[];
  membersApproved: Member[];
};

type TeamEventAttendance = {
  memberEmail: string;
  teamEventName: string;
  hoursAttended?: string;
  image: string;
};

const TeamEventCreditForm: React.FC = () => {
  const userEmail = useUserEmail();
  const getUser = async (email: string): Promise<Member> => MembersAPI.getMember(email);

  const [name, setName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [teamEvent, setTeamEvent] = useState<TeamEvent | undefined>(undefined);
  const [image, setImage] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail)
        .then((mem) => {
          setName(`${mem.firstName} ${mem.lastName}`);
          setRoleDescription(mem.roleDescription);
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

  const requestTeamEventCredit = (eventCreditRequest: TeamEventAttendance) => {
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
    } else if (teamEvent.hasHours && (hours === '' || isNaN(Number(hours)) || Number(hours) < 1)) {
      Emitters.generalError.emit({
        headerMsg: 'No Hours Entered',
        contentMsg: 'Please enter your hours!'
      });
    } else {
      const newTeamEventAttendance: TeamEventAttendance = {
        memberEmail: userEmail,
        teamEventName: teamEvent.name,
        hoursAttended: hours,
        image
      };
      requestTeamEventCredit(newTeamEventAttendance);
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Credit submitted!',
        contentMsg: `The leads were notified of your submission and your credit will be approved soon!`
      });
    }
  };

  const teamEvents: TeamEvent[] = [
    {
      name: 'Coffee Chat',
      date: 'Sept 3',
      numCredits: '0.5',
      hasHours: false,
      membersPending: [],
      membersApproved: []
    },
    {
      name: 'Club Fest',
      date: 'Sept 5',
      numCredits: '0.5',
      hasHours: true,
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

        <div style={{ margin: '2rem 0' }}>
          <label style={{ fontWeight: 'bold' }}>Role:</label>
          <p>{roleDescription}</p>
        </div>

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
                    <Label>
                      {`${event.numCredits} credit(s)`} {event.hasHours ? 'per hour' : ''}
                    </Label>
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
                  alignItems: 'center'
                }}
              >
                <div>
                  <Segment>
                    <h4>{teamEvent.name}</h4>
                    <Label>
                      {`${teamEvent.numCredits} credit(s)`} {teamEvent.hasHours ? 'per hour' : ''}
                    </Label>
                  </Segment>
                </div>

                <Button
                  negative
                  onClick={() => {
                    setTeamEvent(undefined);
                    setHours('0');
                  }}
                  style={{ marginLeft: '1.5em' }}
                >
                  Clear
                </Button>
              </div>
            ) : undefined}
          </div>
        </div>

        {teamEvent?.hasHours ? (
          <div>
            <label style={{ fontWeight: 'bold' }}>
              How many hours did you attend the event? <span style={{ color: '#db2828' }}>*</span>
            </label>
            <Form.Input
              fluid
              type="number"
              step="1"
              size="large"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              style={{ width: '20%' }}
              required
            />
          </div>
        ) : undefined}

        <div style={{ margin: '2rem 0' }}>
          <label htmlFor="newImage" style={{ fontWeight: 'bold' }}>
            Upload your event picture here! <span style={{ color: '#db2828' }}>*</span>
          </label>
          <p style={{ marginBottom: '0' }}>
            Please include a picture of yourself (and others) and/or an email chain only if the
            former is not possible.
          </p>
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

export default TeamEventCreditForm;
