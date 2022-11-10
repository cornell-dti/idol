import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';

type Props = {
  setTeamEvents: React.Dispatch<React.SetStateAction<TeamEvent[]>>;
};

const ClearTeamEventsModal: React.FC<Props> = ({ setTeamEvents }) => (
  <Modal
    basic
    trigger={<Button negative>Clear all Team Events</Button>}
    header="WARNING: Are you sure you want to clear ALL team events?"
    content="Please make sure that you want to clear all team events. Deleting all team events deletes all metadata and corresponding attendance data. This action is NOT recoverable."
    actions={[
      { key: 'cancel', content: 'Cancel', positive: true },
      {
        key: 'confirm',
        content: 'Confirm delete',
        negative: true,
        onClick: () => {
          TeamEventsAPI.clearAllTeamEvents().then(() => setTeamEvents([]));
        }
      }
    ]}
  />
);

export default ClearTeamEventsModal;
