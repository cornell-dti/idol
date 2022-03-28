import React, { useEffect, useState } from 'react';
import { Form, Segment, Label, Button } from 'semantic-ui-react';
import { Emitters, getNetIDFromEmail } from '../../../utils';
import CustomSearch from '../../Common/Search';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import TeamEventCreditDashboard from './TeamEventsCreditDasboard';
import styles from './TeamEventCreditsForm.module.css';
import ImagesAPI from '../../../API/ImagesAPI';

const TeamEventCreditForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;

  const [teamEvent, setTeamEvent] = useState<TeamEvent | undefined>(undefined);
  const [image, setImage] = useState('');
  const [hours, setHours] = useState('');
  const [teamEvents, setTeamEvents] = useState<TeamEvent[]>([]);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEvents().then((teamEvents) => setTeamEvents(teamEvents));
  }, []);

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
  };

  const requestTeamEventCredit = (
    eventCreditRequest: TeamEventAttendance,
    teamEvent: TeamEvent
  ) => {
    teamEvent?.requests.push(eventCreditRequest);
    TeamEventsAPI.requestTeamEventCredit(teamEvent);
    // upload image
    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        const imageURL: string = window.URL.createObjectURL(blob);
        ImagesAPI.uploadEventProofImage(blob, eventCreditRequest.image);
        setImage(imageURL);
      });
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
        member: userInfo,
        hoursAttended: Number(hours),
        image: `eventProofs/${getNetIDFromEmail(userInfo.email)}/${new Date().toISOString()}`
      };
      requestTeamEventCredit(newTeamEventAttendance, teamEvent);
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Credit submitted!',
        contentMsg: `The leads were notified of your submission and your credit will be approved soon!`
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
        <h1>Submit Team Event Credits</h1>
        <p>
          Earn team event credits for participating in DTI events! Fill out this form every time and
          attach a picture of yourself at the event to receive credit.
        </p>
        <div className={styles.inline}>
          <label className={styles.bold}>
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
            <label className={styles.bold}>
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
        <div className={styles.inline}>
          <label htmlFor="newImage" className={styles.bold}>
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
        <TeamEventCreditDashboard teamEvents={teamEvents} />
      </Form>
    </div>
  );
};

export default TeamEventCreditForm;
