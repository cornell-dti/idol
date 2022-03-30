import React, { useState } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';
import { Emitters } from '../../utils';

const TeamEventCreditReview = (props: { teamEvent: TeamEvent, teamEventAttendance: TeamEventAttendance }): JSX.Element => {
    const { teamEvent, teamEventAttendance } = props;
    // const [ image, setImage ] = useState();
    const [open, setOpen] = useState(false);

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
    }

    const approveCreditRequest = () => {
        const updatedTeamEvent = {
            ...teamEvent,
            requests: teamEvent.requests.filter((i) => i !== teamEventAttendance),
            attendees: [...teamEvent.attendees, teamEventAttendance]
        }
        updateTeamEvent(updatedTeamEvent);
    };

    const rejectCreditRequest = () => {
        const updatedTeamEvent = {
            ...teamEvent,
            requests: teamEvent.requests.filter((i) => i !== teamEventAttendance)
        }
        updateTeamEvent(updatedTeamEvent);
    };

    return (
        <Modal
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
                    {teamEvent.hasHours &&
                        <p> Hours Attended: {teamEventAttendance.hoursAttended}</p>
                    }
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button basic color="green" onClick={() => {approveCreditRequest(); setOpen(false);}}>
                    Approve
                </Button>
                <Button basic color="red" onClick={() => { rejectCreditRequest(); setOpen(false);}}>
                    Reject
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
export default TeamEventCreditReview;
