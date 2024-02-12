import React, { useState } from 'react';
import { Button, Card, Form, Icon, Modal, TextArea } from 'semantic-ui-react';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ShoutoutDeleteModal from '../../Modals/ShoutoutDeleteModal';
import { Emitters } from '../../../utils';
import styles from './ShoutoutCard.module.css';

const ShoutoutCard = ({ shoutout, setGivenShoutouts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(shoutout.message);

  const handleEditShoutout = () => {
    ShoutoutsAPI.editShoutout(shoutout.uuid, editedMessage).then((response) => {
      if (!response.error) {
        setGivenShoutouts((prevShoutouts) =>
          prevShoutouts.map((s) =>
            s.uuid === shoutout.uuid ? { ...s, message: editedMessage } : s
          )
        );
        Emitters.generalSuccess.emit({
          headerMsg: 'Success!',
          contentMsg: 'The shoutout message updated successfully.'
        });
        setIsEditing(false);
      } else {
        Emitters.generalError.emit({
          headerMsg: 'Error',
          contentMsg: `The shoutout message failed to update...: ${response.error}`
        });
      }
    });
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
                onChange={(e, { value }) => setEditedMessage(value)}
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
