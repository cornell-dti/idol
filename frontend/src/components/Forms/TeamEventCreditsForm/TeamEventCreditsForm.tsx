import React, { useEffect, useState } from 'react';
import { Form, Segment, Label, Button, Dropdown } from 'semantic-ui-react';
import { Emitters, getNetIDFromEmail } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import TeamEventCreditDashboard from './TeamEventsCreditDasboard';
import styles from './TeamEventCreditsForm.module.css';
import ImagesAPI from '../../../API/ImagesAPI';

const TeamEventCreditForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  const [teamEvent, setTeamEvent] = useState<TeamEventInfo | undefined>(undefined);
  const [image, setImage] = useState('');
  const [hours, setHours] = useState('');
  const [teamEventInfoList, setTeamEventInfoList] = useState<TeamEventInfo[]>([]);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEventInfo().then((teamEvents) => setTeamEventInfoList(teamEvents));
  }, []);

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
  };

  const requestTeamEventCredit = (eventCreditRequest: TeamEventAttendance, uuid: string) => {
    TeamEventsAPI.requestTeamEventCredit(uuid, eventCreditRequest);
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
      requestTeamEventCredit(newTeamEventAttendance, teamEvent.uuid);
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Credit submitted!',
        contentMsg: `The leads were notified of your submission and your credit will be approved soon!`
      });
    }
  };

  return (
    <div>
      <Form className={styles.form_style}>
        <h1>Submit Team Event Credits</h1>
        <p>
          Earn team event credits for participating in DTI events! Fill out this form every time and
          attach a picture of yourself at the event to receive credit.
        </p>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Select a Team Event: <span className={styles.red_color}>*</span>
          </label>
          <div className={styles.center_and_flex}>
            {teamEventInfoList && !teamEvent ? (
              <Dropdown
                placeholder="Select a Team Event"
                fluid
                search
                selection
                options={teamEventInfoList.map((event) => ({
                  key: event.uuid,
                  text: event.name,
                  value: event.uuid
                }))}
                onChange={(_, data) => {
                  setTeamEvent(teamEventInfoList.find((event) => event.uuid === data.value));
                }}
              />
            ) : undefined}

            {teamEvent ? (
              <div className={styles.row_direction}>
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
                  className={styles.inline}
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
              How many hours did you attend the event? <span className={styles.red_color}>*</span>
            </label>
            <Form.Input
              fluid
              type="number"
              step="1"
              size="large"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              className={styles.width_20}
              required
            />
          </div>
        ) : undefined}
        <div className={styles.inline}>
          <label htmlFor="newImage" className={styles.bold}>
            Upload your event picture here! <span className={styles.red_color}>*</span>
          </label>
          <p className={styles.margin_bottom_zero}>
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
        <TeamEventCreditDashboard />
      </Form>
    </div>
  );
};

export default TeamEventCreditForm;
