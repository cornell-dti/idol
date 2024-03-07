import React, { useEffect, useState } from 'react';
import { Form, Segment, Label, Button, Dropdown } from 'semantic-ui-react';
import { Emitters, getNetIDFromEmail } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import TeamEventCreditDashboard from './TeamEventsCreditDashboard';
import styles from './TeamEventCreditsForm.module.css';
import ImagesAPI from '../../../API/ImagesAPI';
import { INITIATIVE_EVENTS } from '../../../consts';

const TeamEventCreditForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  const [teamEvent, setTeamEvent] = useState<TeamEventInfo | undefined>(undefined);
  const [hours, setHours] = useState('');
  const [teamEventInfoList, setTeamEventInfoList] = useState<TeamEventInfo[]>([]);
  const [approvedAttendance, setApprovedAttendance] = useState<TeamEventAttendance[]>([]);
  const [pendingAttendance, setPendingAttendance] = useState<TeamEventAttendance[]>([]);
  const [rejectedAttendance, setRejectedAttendance] = useState<TeamEventAttendance[]>([]);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>(['']);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEventInfo().then((teamEvents) => setTeamEventInfoList(teamEvents));
    TeamEventsAPI.getTeamEventAttendanceByUser().then((attendance) => {
      setApprovedAttendance(attendance.filter((attendee) => attendee.status === 'approved'));
      setPendingAttendance(attendance.filter((attendee) => attendee.status === 'pending'));
      setRejectedAttendance(attendance.filter((attendee) => attendee.status === 'rejected'));
      setIsAttendanceLoading(false);
    });
  }, []);

  const handleAddIconClick = () => {
    setImages((images) => [...images, '']);
  };

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    const newImages = images.map((currentImage, i) => {
      if (i === index) {
        return newImage;
      }
      return currentImage;
    });
    setImages(newImages);
  };

  const requestTeamEventCredit = async (
    eventCreditRequest: TeamEventAttendance,
    uploadedImage: string
  ) => {
    const createdAttendance = await TeamEventsAPI.requestTeamEventCredit(eventCreditRequest);
    // upload image
    const blob = await fetch(uploadedImage).then((res) => res.blob());
    await ImagesAPI.uploadEventProofImage(blob, eventCreditRequest.image);
    return createdAttendance;
  };

  const submitTeamEventCredit = async () => {
    if (!teamEvent) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Selected',
        contentMsg: 'Please select a team event!'
      });
    } else if (images.some((image) => image === '')) {
      Emitters.generalError.emit({
        headerMsg: 'Unsuccessful Image Upload',
        contentMsg: 'Please upload all images from top to bottom!'
      });
    } else if (teamEvent.hasHours && (hours === '' || isNaN(Number(hours)))) {
      Emitters.generalError.emit({
        headerMsg: 'No Hours Entered',
        contentMsg: 'Please enter your hours!'
      });
    } else if (teamEvent.hasHours && Number(hours) < 0.5) {
      Emitters.generalError.emit({
        headerMsg: 'Minimum Hours Violated',
        contentMsg: 'Team events must be logged for at least 0.5 hours!'
      });
    } else {
      await Promise.all(
        images.map(async (image, i) => {
          const newTeamEventAttendance: TeamEventAttendance = {
            member: userInfo,
            hoursAttended: teamEvent.hasHours ? Number(hours) : undefined,
            image: `eventProofs/${getNetIDFromEmail(
              userInfo.email
            )}/${new Date().toISOString()}[${i}]`,
            eventUuid: teamEvent.uuid,
            status: 'pending' as Status,
            reason: '',
            uuid: ''
          };

          const createdAttendance = await requestTeamEventCredit(newTeamEventAttendance, image);

          if (createdAttendance) {
            setPendingAttendance((pending) => [...pending, createdAttendance]);
          }
        })
      );
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Credit submitted!',
        contentMsg: `The leads were notified of your submission, and your credit will be approved soon!`
      });
      setTeamEvent(undefined);
      setHours('0');
      setImages(['']);
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
                search={(options, query) =>
                  options.filter((option) => option.key.toLowerCase().includes(query.toLowerCase()))
                }
                selection
                options={teamEventInfoList
                  .sort((e1, e2) => new Date(e2.date).getTime() - new Date(e1.date).getTime())
                  .map((event) => ({
                    key: event.name,
                    label: (
                      <div className={styles.flex_space_center}>
                        <div className={styles.flex_start}>{event.name}</div>
                        <div className={styles.flex_end}>
                          {INITIATIVE_EVENTS && event.isInitiativeEvent && (
                            <Label content="initiative" />
                          )}
                          <Label
                            content={`${new Date(event.date).toLocaleDateString('en-us', {
                              month: 'short',
                              day: 'numeric'
                            })}`}
                          ></Label>

                          <Label
                            content={`${event.numCredits} ${
                              Number(event.numCredits) === 1 ? 'credit' : 'credits'
                            } ${event.hasHours ? 'per hour' : ''}`}
                          ></Label>
                        </div>
                      </div>
                    ),
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

          {images.map((image, i) => (
            <div style={{ marginBottom: '10px' }} key={i}>
              <input
                id="newImage"
                type="file"
                accept="image/png, image/jpeg"
                value={image ? undefined : ''}
                onChange={(e) => handleNewImage(e, i)}
              />
            </div>
          ))}
        </div>
        <Form.Button
          floated="right"
          size="mini"
          style={{ marginBottom: '10px' }}
          onClick={handleAddIconClick}
        >
          +
        </Form.Button>
        <Form.Button
          floated="right"
          onClick={async () => {
            await submitTeamEventCredit();
          }}
        >
          Submit
        </Form.Button>
        <TeamEventCreditDashboard
          allTEC={teamEventInfoList}
          approvedAttendance={approvedAttendance}
          pendingAttendance={pendingAttendance}
          rejectedAttendance={rejectedAttendance}
          isAttendanceLoading={isAttendanceLoading}
          setPendingAttendance={setPendingAttendance}
        />
      </Form>
    </div>
  );
};

export default TeamEventCreditForm;
