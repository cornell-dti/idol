import React, { useState } from 'react';
import { Form, Radio, Button } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';
import styles from './TeamEventForm.module.css';
import { INITIATIVE_EVENTS } from '../../../consts';

type Props = {
  formType: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  teamEvent?: TeamEvent;
  editTeamEvent?: (teamEvent: TeamEvent) => void;
};

const TeamEventForm = (props: Props): JSX.Element => {
  const { formType, setOpen, teamEvent, editTeamEvent } = props;

  const [teamEventName, setTeamEventName] = useState(teamEvent?.name || '');
  const [teamEventDate, setTeamEventDate] = useState(teamEvent?.date || '');
  const [teamEventCreditNum, setTeamEventCreditNum] = useState(teamEvent?.numCredits || '');
  const [teamEventHasHours, setTeamEventHasHours] = useState(teamEvent?.hasHours || false);
  const [isInitiativeEvent, setisInitiativeEvent] = useState<boolean>(
    teamEvent?.isInitiativeEvent || false
  );
  const [maxCreditNum, setMaxCreditNum] = useState(teamEvent?.maxCredits || '');

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
      isNaN(Number(teamEventCreditNum))
    ) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Credit Amount',
        contentMsg: 'Please enter how many credits the event is worth!'
      });
    } else if (Number(teamEventCreditNum) < 0.25) {
      Emitters.generalError.emit({
        headerMsg: 'Minumum Credits Violated',
        contentMsg: 'Team events must be worth a minimum of 0.25 credits!'
      });
    } else if (Number(teamEventCreditNum) > Number(maxCreditNum)) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Credits',
        contentMsg: 'The maximum credits cannot be greater than the team event credit!'
      });
    } else if (Number(maxCreditNum) % Number(teamEventCreditNum) !== 0) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Credits',
        contentMsg: 'The maximum credits needs to be a multiple of the team event credit!'
      });
    } else if (teamEvent && editTeamEvent) {
      const editedTeamEvent: TeamEvent = {
        ...teamEvent,
        name: teamEventName,
        date: teamEventDate,
        numCredits: teamEventCreditNum,
        hasHours: teamEventHasHours,
        isCommunity: isInitiativeEvent,
        isInitiativeEvent,
        maxCredits: maxCreditNum
      };
      editTeamEvent(editedTeamEvent);
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Updated!',
        contentMsg: 'The team event was successfully updated!'
      });
    } else {
      const newTeamEventInfo: TeamEventInfo = {
        uuid: '',
        name: teamEventName,
        date: teamEventDate,
        numCredits: teamEventCreditNum,
        hasHours: teamEventHasHours,
        isInitiativeEvent,
        maxCredits: maxCreditNum
      };
      TeamEventsAPI.createTeamEventForm(newTeamEventInfo).then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't create the team event!",
            contentMsg: val.error
          });
        } else {
          Emitters.generalSuccess.emit({
            headerMsg: 'Team Event Created!',
            contentMsg: 'The team event was successfully created!'
          });
          setTeamEventName('');
          setTeamEventDate('');
          setTeamEventCreditNum('');
          setTeamEventHasHours(false);
          Emitters.teamEventsUpdated.emit();
        }
      });
    }
  };

  return (
    <div>
      <Form>
        <Form.Input
          value={teamEventName}
          onChange={(event) => setTeamEventName(event.target.value)}
          label={
            <label className={styles.label}>
              Event Name: <span className={styles.required}>*</span>
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
            <label className={styles.label}>
              Event Date: <span className={styles.required}>*</span>
            </label>
          }
        ></Form.Input>

        <Form.Input
          value={teamEventCreditNum}
          onChange={(event) => {
            setTeamEventCreditNum(event.target.value);
          }}
          type="number"
          step="0.5"
          label={
            <label className={styles.label}>
              How many credits is this event worth? <span className={styles.required}>*</span>
            </label>
          }
        ></Form.Input>

        <Form.Input
          value={maxCreditNum}
          onChange={(event) => {
            setMaxCreditNum(event.target.value);
          }}
          type="number"
          step="0.5"
          label={
            <label className={styles.label}>
              What is the maximum number of credits a member can receive from this event?{' '}
              <span className={styles.required}>*</span>
            </label>
          }
        ></Form.Input>

        <label htmlFor="radioGroup" className={styles.label}>
          Does this event have hours? <span className={styles.required}>*</span>
        </label>
        <Form.Group inline>
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
        </Form.Group>

        {INITIATIVE_EVENTS && (
          <label className={styles.label}>
            Is this an initiative event? <span className={styles.required}>*</span>
          </label>
        )}
        {INITIATIVE_EVENTS && (
          <Form.Group inline>
            <Form.Field>
              <Radio
                label="Yes"
                value="Yes"
                checked={isInitiativeEvent}
                onChange={() => setisInitiativeEvent(true)}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="No"
                value="No"
                checked={!isInitiativeEvent}
                onChange={() => setisInitiativeEvent(false)}
              />
            </Form.Field>
          </Form.Group>
        )}

        {formType === 'create' && (
          <Form.Button floated="right" onClick={submitTeamEvent}>
            Create Event
          </Form.Button>
        )}

        {formType === 'edit' && setOpen && (
          <div className={styles.buttonsWrapper}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              content="Save"
              labelPosition="right"
              icon="checkmark"
              onClick={() => {
                setOpen(false);
                submitTeamEvent();
              }}
              positive
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default TeamEventForm;
