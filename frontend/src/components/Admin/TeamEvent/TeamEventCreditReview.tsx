import React, { useEffect, useState } from 'react';
import { Modal, Button, Header, Image, Loader, Input } from 'semantic-ui-react';
import styles from './TeamEventCreditReview.module.css';
import ImagesAPI from '../../../API/ImagesAPI';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';

const TeamEventCreditReview = ({
  teamEvent,
  teamEventAttendance,
  currentStatus,
  onClose
}: {
  teamEvent: TeamEvent;
  teamEventAttendance: TeamEventAttendance;
  currentStatus: Status;
  onClose: () => void;
}): JSX.Element => {
  const [image, setImage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [reason, setReason] = useState(teamEventAttendance.reason || '');

  useEffect(() => {
    if (teamEventAttendance.image) {
      setLoading(true);
      ImagesAPI.getImage(teamEventAttendance.image).then((url: string) => {
        setImage(url);
        setLoading(false);
      });
    }
  }, [teamEventAttendance]);

  const approveCreditRequest = () => {
    const updatedAttendance = { ...teamEventAttendance, status: 'approved' as Status, reason: '' };
    TeamEventsAPI.updateTeamEventAttendance(updatedAttendance)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Approved!',
          contentMsg: 'The team event attendance was successfully approved!'
        });
        Emitters.teamEventsUpdated.emit();
        onClose();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't approve the team event attendance!",
          contentMsg: error
        });
      });
  };

  const rejectCreditRequest = () => {
    const updatedAttendance = { ...teamEventAttendance, status: 'rejected' as Status, reason };
    TeamEventsAPI.updateTeamEventAttendance(updatedAttendance)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Rejected!',
          contentMsg: 'The team event attendance was successfully rejected!'
        });
        Emitters.teamEventsUpdated.emit();
        onClose();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't reject the team event attendance!",
          contentMsg: error
        });
      });
  };

  return (
    <Modal closeIcon onClose={onClose} open>
      <Modal.Header>Team Event Credit Review</Modal.Header>
      <Modal.Content className={styles.modalContent} scrolling>
        <Modal.Description>
          <Header>
            {teamEventAttendance.member.firstName} {teamEventAttendance.member.lastName}
          </Header>
          <p>Team Event: {teamEvent.name}</p>
          <p>Number of Credits: {teamEvent.numCredits}</p>
          {teamEvent.hasHours && <p>Hours Attended: {teamEventAttendance.hoursAttended}</p>}
          {currentStatus === 'rejected' && teamEventAttendance.reason && (
            <p>
              <strong>Rejection Reason:</strong> {teamEventAttendance.reason}
            </p>
          )}
          {isLoading ? <Loader className="modalLoader" active inline /> : <Image src={image} />}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        {currentStatus !== 'rejected' && (
          <Input
            type="text"
            placeholder="Reason for reject"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}
        {currentStatus === 'approved' && (
          <Button basic color="red" disabled={reason === ''} onClick={rejectCreditRequest}>
            Set to Rejected
          </Button>
        )}
        {currentStatus === 'rejected' && (
          <Button basic color="green" onClick={approveCreditRequest}>
            Set to Approved
          </Button>
        )}
        {currentStatus === 'pending' && (
          <>
            <Button basic color="green" onClick={approveCreditRequest}>
              Approve
            </Button>
            <Button basic color="red" disabled={reason === ''} onClick={rejectCreditRequest}>
              Reject
            </Button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default TeamEventCreditReview;
