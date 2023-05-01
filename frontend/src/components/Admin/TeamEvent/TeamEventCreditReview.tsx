import React, { useEffect, useState } from 'react';
import { Modal, Button, Header, Image } from 'semantic-ui-react';
import ImagesAPI from '../../../API/ImagesAPI';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';

const TeamEventCreditReview = (props: {
  teamEvent: TeamEvent;
  teamEventAttendance: TeamEventAttendance;
}): JSX.Element => {
  const { teamEvent, teamEventAttendance } = props;
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    ImagesAPI.getEventProofImage(teamEventAttendance.image).then((url: string) => {
      setImage(url);
    });
  }, [teamEventAttendance]);

  const updateTeamEvent = (updatedTeamEvent: TeamEvent) => {
    TeamEventsAPI.updateTeamEventForm(updatedTeamEvent).then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't update the team event!",
          contentMsg: val.error
        });
      } else {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Updated!',
          contentMsg: 'The team event was successfully updated!'
        });
        Emitters.teamEventsUpdated.emit();
      }
    });
  };

  const approveCreditRequest = () => {
    const updatedTeamEvent = {
      ...teamEvent,
      requests: teamEvent.requests.filter((i) => i !== teamEventAttendance),
      attendees: [...teamEvent.attendees, teamEventAttendance]
    };
    updateTeamEvent(updatedTeamEvent);
  };

  const rejectCreditRequest = () => {
    const updatedTeamEvent = {
      ...teamEvent,
      requests: teamEvent.requests.filter((i) => i !== teamEventAttendance)
    };
    ImagesAPI.deleteEventProofImage(teamEventAttendance.image).then((_) => {
      updateTeamEvent(updatedTeamEvent);
    });
  };

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Review request</Button>}
    >
      <Modal.Header>Team Event Credit Review</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            {teamEventAttendance.member.firstName} {teamEventAttendance.member.lastName}
          </Header>
          <p>Team Event: {teamEvent.name}</p>
          <p>Number of Credits: {teamEvent.numCredits}</p>
          {teamEvent.hasHours && <p> Hours Attended: {teamEventAttendance.hoursAttended}</p>}
          <Image src={image} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="green"
          onClick={() => {
            Emitters.teamEventsUpdated.emit();
            approveCreditRequest(teamEventAttendance);
            setOpen(false);
          }}
        >
          Approve
        </Button>
        <Button
          basic
          color="red"
          onClick={() => {
            Emitters.teamEventsUpdated.emit();
            rejectCreditRequest();
            setOpen(false);
          }}
        >
          Reject
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default TeamEventCreditReview;
