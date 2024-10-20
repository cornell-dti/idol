import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button, Card, Form, Icon, Modal, TextArea } from 'semantic-ui-react';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ShoutoutDeleteModal from '../../Modals/ShoutoutDeleteModal';
import styles from './ShoutoutCard.module.css';

interface ShoutoutCardProps {
  shoutout: Shoutout;
  setGivenShoutouts: Dispatch<SetStateAction<Shoutout[]>>;
}

const ShoutoutCard: React.FC<ShoutoutCardProps> = ({ shoutout, setGivenShoutouts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(shoutout.message);

  const handleEditShoutout = async () => {
    try {
      await ShoutoutsAPI.updateShoutout(shoutout.uuid, { message: editedMessage });
      setGivenShoutouts((prevShoutouts) =>
        prevShoutouts.map((s) => (s.uuid === shoutout.uuid ? { ...s, message: editedMessage } : s))
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit shoutout:', error);
    }
  };

  return (
    <Card className={styles.shoutoutCardContainer}>
      <Card.Group widths="equal" className={styles.shoutoutCardDetails}>
        <Card.Content header={`To: ${shoutout.receiver}`} className={styles.shoutoutTo} />
        <Card.Content
          className={styles.shoutoutDate}
          content={new Date(shoutout.timestamp).toDateString()}
        />
      </Card.Group>
      <div className={styles.shoutoutActions}>
        <Card.Meta
          className={styles.shoutoutFrom}
          content={
            shoutout.isAnon
              ? 'From: Anonymous'
              : `From: ${shoutout.giver.firstName} ${shoutout.giver.lastName}`
          }
        />
        <div>
          <ShoutoutDeleteModal uuid={shoutout.uuid} setGivenShoutouts={setGivenShoutouts} />
          <Button icon onClick={() => setIsEditing(true)}>
            <Icon name="edit" />
          </Button>
        </div>
      </div>
      <Card.Content description={shoutout.message} />
      <Modal open={isEditing} onClose={() => setIsEditing(false)}>
        <Modal.Header>Edit Shoutout</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Message</label>
              <TextArea
                value={editedMessage}
                onChange={(e, { value }) => setEditedMessage((value || '') as string)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsEditing(false)} negative>
            Cancel
          </Button>
          <Button onClick={handleEditShoutout} positive>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </Card>
  );
};

export default ShoutoutCard;
