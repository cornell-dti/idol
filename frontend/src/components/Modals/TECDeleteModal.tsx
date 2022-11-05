import React, { useState } from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';
import styles from './TECDeleteModal.module.css';

type Props = {
  uuid: string;
  name: string;
  setTeamEvents: React.Dispatch<React.SetStateAction<TeamEvent[]>>;
};

const TECDeleteModal: React.FC<Props> = ({ uuid, name, setTeamEvents }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Icon className={styles.trashIcon} name="trash" color="red" />}
    >
      <Modal.Header>
        Are you sure you want to delete <b>{name}</b>?
      </Modal.Header>
      <Modal.Description>
        Deleting this team event will delete all metadata and corresponding credit requests
      </Modal.Description>
      <Modal.Actions>
        <Button positive onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          negative
          onClick={() => {
            TeamEventsAPI.deleteTeamEventForm(uuid).then(() => {
              setTeamEvents((teamEvents) =>
                teamEvents.filter((teamEvent) => teamEvent.uuid !== uuid)
              );
              setIsOpen(false);
            });
          }}
        >
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default TECDeleteModal;
