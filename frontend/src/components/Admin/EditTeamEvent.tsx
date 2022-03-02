import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';
import { Emitters } from '../../utils';
import TeamEventForm from './TeamEventForm';

const EditTeamEvent = (props: { teamEvent: TeamEvent }): JSX.Element => {
  const { teamEvent } = props;
  const [open, setOpen] = useState(false);

  const editTeamEvent = (teamEvent: TeamEvent) => {
    TeamEventsAPI.updateTeamEventForm(teamEvent).then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't edit the team event!",
          contentMsg: val.error
        });
      } else {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Edited!',
          contentMsg: 'The team event was successfully edited!'
        });
      }
    });
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Edit Event</Button>}
    >
      <Modal.Header>Edit Team Event</Modal.Header>
      <Modal.Content>
        <TeamEventForm
          formType={'edit'}
          teamEvent={teamEvent}
          editTeamEvent={editTeamEvent}
          setOpen={setOpen}
        ></TeamEventForm>
      </Modal.Content>
    </Modal>
  );
};
export default EditTeamEvent;
