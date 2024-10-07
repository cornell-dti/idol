import React, { useState, useEffect } from 'react';
import { Card, Image, Loader } from 'semantic-ui-react';
import ShoutoutDeleteModal from '../../Modals/ShoutoutDeleteModal';
import styles from './ShoutoutCard.module.css';
import ImagesAPI from '../../../API/ImagesAPI';

const ShoutoutCard = (props: {
  shoutout: Shoutout;
  setGivenShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
}): JSX.Element => {
  const { shoutout, setGivenShoutouts } = props;

  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fromString = shoutout.isAnon
    ? 'From: Anonymous'
    : `From: ${shoutout.giver?.firstName || ''} ${shoutout.giver?.lastName || ''}`.trim();
  const dateString = new Date(shoutout.timestamp).toDateString();

  useEffect(() => {
    if (shoutout.images && shoutout.images.length > 0) {
      setIsLoading(true);
      ImagesAPI.getEventProofImage(shoutout.images[0])
        .then((url: string) => {
          setImage(url);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [shoutout.images]);

  return (
    <Card className={styles.shoutoutCardContainer}>
      <Card.Group widths="equal" className={styles.shoutoutCardDetails}>
        <Card.Content header={`To: ${shoutout.receiver}`} className={styles.shoutoutTo} />
        <Card.Content className={styles.shoutoutDate} content={dateString} />
      </Card.Group>
      <Card.Group widths="equal" className={styles.shoutoutDelete}>
        <Card.Meta className={styles.shoutoutFrom} content={fromString} />
        <ShoutoutDeleteModal uuid={shoutout.uuid} setGivenShoutouts={setGivenShoutouts} />
      </Card.Group>
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
    </Card>
  );
};

export default ShoutoutCard;
