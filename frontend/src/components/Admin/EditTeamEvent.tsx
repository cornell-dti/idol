import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import TeamEventForm from './TeamEventForm';
import { TeamEvent } from './TeamEvents';

const EditTeamEvent = (props: { teamEvent: TeamEvent }): JSX.Element => {
  const { teamEvent } = props;
  const [open, setOpen] = useState(false);

  const editTeamEvent = (teamEvent: TeamEvent) => {
    // send edited event to backend
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
