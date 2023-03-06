import React, { useState } from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import ShoutoutsAPI from '../../API/ShoutoutsAPI';
import styles from './ShoutoutDeleteModal.module.css';

type Props = {
  uuid: string;
  setGivenShoutouts: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
};

const ShoutoutDeleteModal: React.FC<Props> = ({ uuid, setGivenShoutouts }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Modal
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      open={isOpen}
      trigger={<Icon className={styles.trashIcon} name="trash" color="red" />}
    >
      <Modal.Header>Are you sure you want to delete this shoutout?</Modal.Header>
      <Modal.Description>Deleting this shoutout cannot be undone.</Modal.Description>
      <Modal.Actions>
        <Button positive onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          negative
          onClick={() => {
            ShoutoutsAPI.deleteShoutout(uuid).then(() =>
              setGivenShoutouts((shoutouts) => shoutouts.filter((it) => it.uuid !== uuid))
            );
            setIsOpen(false);
          }}
        >
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ShoutoutDeleteModal;
