import React, { useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { Emitters, getNetIDFromEmail } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import TeamEventCreditDashboard from './TeamEventsCreditDasboard';
import styles from './TeamEventCreditsForm.module.css';
import ImagesAPI from '../../../API/ImagesAPI';
import LabeledDropdown from '../../Common/LabeledDropdown';

const TeamEventCreditForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  const [teamEvent, setTeamEvent] = useState<TeamEventInfo | undefined>(undefined);
  const [image, setImage] = useState('');
  const [hours, setHours] = useState('');
  const [teamEventInfoList, setTeamEventInfoList] = useState<TeamEventInfo[]>([]);
  const [approvedTEC, setApprovedTEC] = useState<TeamEventInfo[]>([]);
  const [pendingTEC, setPendingTEC] = useState<TeamEventInfo[]>([]);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEventInfo().then((teamEvents) => setTeamEventInfoList(teamEvents));
    TeamEventsAPI.getAllTeamEventsForMember().then((val) => {
      setApprovedTEC(val.approved);
      setPendingTEC(val.pending);
    });
  }, []);

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
  };

  const requestTeamEventCredit = async (eventCreditRequest: TeamEventAttendance, uuid: string) => {
    await TeamEventsAPI.requestTeamEventCredit(uuid, eventCreditRequest);
    // upload image

    const blob = await fetch(image).then((res) => res.blob());

    const imageURL: string = window.URL.createObjectURL(blob);
    await ImagesAPI.uploadEventProofImage(blob, eventCreditRequest.image).then(() =>
      setImage(imageURL)
    );
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
    } else if (teamEvent.hasHours && (hours === '' || isNaN(Number(hours)))) {
      Emitters.generalError.emit({
        headerMsg: 'No Hours Entered',
        contentMsg: 'Please enter your hours!'
      });
    } else if (Number(hours) < 0.5) {
      Emitters.generalError.emit({
        headerMsg: 'Minimum Hours Violated',
        contentMsg: 'Team events must be logged for at least 0.5 hours!'
      });
    } else {
      const newTeamEventAttendance: TeamEventAttendance = {
        member: userInfo,
        hoursAttended: Number(hours),
        image: `eventProofs/${getNetIDFromEmail(userInfo.email)}/${new Date().toISOString()}`
      };
      requestTeamEventCredit(newTeamEventAttendance, teamEvent.uuid).then(() => {
        setPendingTEC((pending) => [...pending, teamEvent]);
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Credit submitted!',
          contentMsg: `The leads were notified of your submission and your credit will be approved soon!`
        });
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
            {teamEventInfoList && (
              <LabeledDropdown
                placeholder="Select a Team Event"
                fluid
                clearable
                selection
                data={teamEventInfoList
                  .sort((e1, e2) => new Date(e2.date).getTime() - new Date(e1.date).getTime())
                  .map((event) => ({
                    key: event.uuid,
                    label: event.name,
                    info: [
                      `${new Date(event.date).toLocaleDateString('en-us', {
                        month: 'short',
                        day: 'numeric'
                      })}`,
                      `${event.numCredits} ${
                        Number(event.numCredits) === 1 ? 'credit' : 'credits'
                      } ${event.hasHours ? 'per hour' : ''}`
                    ],
                    value: event.uuid
                  }))}
                value={teamEvent?.uuid}
                onChange={(_, data) => {
                  setTeamEvent(teamEventInfoList.find((event) => event.uuid === data.value));
                }}
              />
            )}
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
        <TeamEventCreditDashboard pendingTEC={pendingTEC} approvedTEC={approvedTEC} />
      </Form>
    </div>
  );
};

export default TeamEventCreditForm;
