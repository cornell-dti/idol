import { Card } from 'semantic-ui-react';
import { Shoutout } from '../../../API/ShoutoutsAPI';
import styles from './ShoutoutCard.module.css';

const ShoutoutCard = (props: Shoutout): JSX.Element => {
  const { giver, receiver, message, isAnon, timestamp } = props;

  const fromString = isAnon ? 'From: Anonymous' : `From: ${giver?.firstName} ${giver?.lastName}`;
  const dateString = `${new Date(timestamp).toDateString()}`;

  return (
    <Card className={styles.shoutoutCardContainer}>
      <Card.Group widths="equal" className={styles.shoutoutCardDetails}>
        <Card.Content header={`To: ${receiver}`} className={styles.shoutoutTo} />
        <Card.Content className={styles.shoutoutDate} content={dateString} />
      </Card.Group>
      <Card.Meta className={styles.shoutoutFrom} content={fromString} />
      <Card.Content description={message} />
    </Card>
  );
};
export default ShoutoutCard;
