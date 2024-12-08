import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Button, Card, Image, Loader, Form, Icon, Modal, TextArea } from 'semantic-ui-react';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ImagesAPI from '../../../API/ImagesAPI';
import ShoutoutDeleteModal from '../../Modals/ShoutoutDeleteModal';
import styles from './ShoutoutCard.module.css';

interface ShoutoutCardProps {
  shoutout: Shoutout;
  setGivenShoutouts: Dispatch<SetStateAction<Shoutout[]>>;
}

const ShoutoutCard: React.FC<ShoutoutCardProps> = ({ shoutout, setGivenShoutouts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(shoutout.message);
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEditShoutout = async () => {
    const updatedShoutout = {
      ...shoutout,
      message: editedMessage
    };
    await ShoutoutsAPI.updateShoutout(shoutout.uuid, updatedShoutout);
    setGivenShoutouts((prevShoutouts) =>
      prevShoutouts.map((s) => (s.uuid === shoutout.uuid ? { ...s, message: editedMessage } : s))
    );
    setIsEditing(false);
  };

  useEffect(() => {
    if (shoutout.images && shoutout.images.length > 0) {
      setIsLoading(true);
      ImagesAPI.getImage(shoutout.images[0])
        .then((url: string) => {
          setImage(url);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [shoutout.images]);

  const fromString = shoutout.isAnon
    ? 'From: Anonymous'
    : `From: ${shoutout.giver?.firstName || ''} ${shoutout.giver?.lastName || ''}`.trim();
  const dateString = new Date(shoutout.timestamp).toDateString();

  return (
    <Card className={styles.shoutoutCardContainer}>
      <Card.Group widths="equal" className={styles.shoutoutCardDetails}>
        <Card.Content header={`To: ${shoutout.receiver}`} className={styles.shoutoutTo} />
        <Card.Content className={styles.shoutoutDate} content={dateString} />
      </Card.Group>
      <div className={styles.shoutoutActions}>
        <Card.Meta className={styles.shoutoutFrom} content={fromString} />
        <div className={styles.actionIcons}>
          <Icon
            name="edit"
            onClick={() => setIsEditing(true)}
            className={styles.editIcon}
            aria-label="Edit Shoutout"
          />
          <ShoutoutDeleteModal uuid={shoutout.uuid} setGivenShoutouts={setGivenShoutouts} />
        </div>
      </div>
      <Card.Content description={shoutout.message} />
      {isLoading ? (
        <Loader active inline />
      ) : (
        image?.length > 0 && (
          <Card.Content>
            <div className={styles.imageContainer}>
              <Image src={image} size="small" alt="shoutout image" />
            </div>
          </Card.Content>
        )
      )}
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
