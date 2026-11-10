import React, { useState } from 'react';
import { Modal, Icon, Button, Message } from 'semantic-ui-react';
import ShoutoutsAPI from '../../API/ShoutoutsAPI';
import styles from './ShoutoutDeleteModal.module.css';

type Props = {
  uuid: string;
  setGivenShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
};

const ShoutoutDeleteModal: React.FC<Props> = ({ uuid, setGivenShoutouts }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);

  const remove = async () => {
    if (deleting) return;
    setDeleting(true);
    setError(false);
    try {
      await ShoutoutsAPI.deleteShoutout(uuid);
      setGivenShoutouts((shoutouts) => shoutouts.filter((it) => it.uuid !== uuid));
      setIsOpen(false);
    } catch {
      setError(true);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      onOpen={() => {
        setError(false);
        setIsOpen(true);
      }}
      onClose={() => {
        if (!deleting) setIsOpen(false);
      }}
      open={isOpen}
      trigger={<Icon className={styles.trashIcon} name="trash" color="red" />}
    >
      <Modal.Header>Are you sure you want to delete this shoutout?</Modal.Header>
      {error && (
        <Modal.Content>
          <Message
            negative
            role="alert"
            content="Could not delete this shoutout. Please try again."
          />
        </Modal.Content>
      )}
      <Modal.Actions>
        <Button positive disabled={deleting} onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button negative loading={deleting} disabled={deleting} onClick={remove}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ShoutoutDeleteModal;
