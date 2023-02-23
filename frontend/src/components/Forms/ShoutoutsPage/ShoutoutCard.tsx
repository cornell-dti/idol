import { Card } from 'semantic-ui-react';
import ShoutoutDeleteModal from '../../Modals/ShoutoutDeleteModal';
import styles from './ShoutoutCard.module.css';

const ShoutoutCard = (props: {
  shoutout: Shoutout;
  setGivenShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
}): JSX.Element => {
  const { shoutout, setGivenShoutouts } = props;

  const fromString = shoutout.isAnon
    ? 'From: Anonymous'
    : `From: ${shoutout.giver?.firstName} ${shoutout.giver?.lastName}`;
  const dateString = `${new Date(shoutout.timestamp).toDateString()}`;

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
    </Card>
  );
};
export default ShoutoutCard;
