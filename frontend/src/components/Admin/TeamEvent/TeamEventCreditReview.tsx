import React, { useEffect, useState } from 'react';
import { Modal, Button, Header, Image, Loader, Input } from 'semantic-ui-react';
import styles from './TeamEventCreditReview.module.css';
import ImagesAPI from '../../../API/ImagesAPI';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';

const TeamEventCreditReview = (props: {
  teamEvent: TeamEvent;
  teamEventAttendance: TeamEventAttendance;
  currentStatus: Status;
}): JSX.Element => {
  const { teamEvent, teamEventAttendance, currentStatus } = props;
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    setLoading(true);
    ImagesAPI.getEventProofImage(teamEventAttendance.image).then((url: string) => {
      setImage(url);
      setLoading(false);
    });
  }, [teamEventAttendance]);

  const approveCreditRequest = (teamEventAttendance: TeamEventAttendance) => {
    const updatedTeamEventAttendance = {
      ...teamEventAttendance,
      pending: false,
      status: 'approved' as Status,
      reason
    };
    TeamEventsAPI.updateTeamEventAttendance(updatedTeamEventAttendance)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Approved!',
          contentMsg: 'The team event attendance was successfully approved!'
        });
        Emitters.teamEventsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't approve the team event attendance!",
          contentMsg: error
        });
      });
  };

  const rejectCreditRequest = () => {
    const updatedTeamEventAttendance = {
      ...teamEventAttendance,
      status: 'rejected' as Status,
      reason
    };
    TeamEventsAPI.updateTeamEventAttendance(updatedTeamEventAttendance)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Rejected!',
          contentMsg: 'The team event attendance was successfully rejected!'
        });
        ImagesAPI.deleteEventProofImage(teamEventAttendance.image);
        Emitters.teamEventsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't reject the team event attendance!",
          contentMsg: error
        });
      });
  };

  if (currentStatus === 'approved') {
    return (
      <>
        <Input
          className={styles.rejectText}
          type="text"
          placeholder="Reason for reject"
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          basic
          color="red"
          disabled={reason === ''}
          onClick={() => {
            rejectCreditRequest();
          }}
        >
          Set to Rejected
        </Button>
      </>
    );
  }
  if (currentStatus === 'rejected') {
    return (
      <Button
        basic
        color="green"
        onClick={() => {
          approveCreditRequest(teamEventAttendance);
        }}
      >
        Set to Approved
      </Button>
    );
  }
  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Review request</Button>}
    >
      <Modal.Header>Team Event Credit Review</Modal.Header>
      <Modal.Content className={styles.modalContent} scrolling>
        <Modal.Description>
          <Header>
            {teamEventAttendance.member.firstName} {teamEventAttendance.member.lastName}
          </Header>
          <p>Team Event: {teamEvent.name}</p>
          <p>Number of Credits: {teamEvent.numCredits}</p>
          {teamEvent.hasHours && <p> Hours Attended: {teamEventAttendance.hoursAttended}</p>}
          {isLoading ? <Loader className="modalLoader" active inline /> : <Image src={image} />}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="green"
          onClick={() => {
            approveCreditRequest(teamEventAttendance);
            setOpen(false);
          }}
        >
          Approve
        </Button>
        <Button
          basic
          color="red"
          disabled={reason === ''}
          onClick={() => {
            rejectCreditRequest();
            setOpen(false);
          }}
        >
          Reject
        </Button>
        <Input
          type="text"
          placeholder="Reason for reject"
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal.Actions>
    </Modal>
  );
};
export default TeamEventCreditReview;
