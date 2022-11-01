import { Card } from 'semantic-ui-react';
import { Shoutout } from '../../../API/ShoutoutsAPI';

const ShoutoutCard = (props: Shoutout): JSX.Element => {
  const { giver, receiver, message, isAnon, timestamp } = props;

  let fromString = isAnon ? 'From: Anonymous' : `From: ${giver?.firstName} ${giver?.lastName}`;

  fromString += ` (Date: ${new Date(timestamp).toDateString()})`;

  return (
    <Card style={{ width: '100%' }}>
      <Card.Content header={`To: ${receiver}`} />
      <Card.Meta style={{ paddingLeft: '1rem', paddingBottom: '1rem' }} content={fromString} />
      <Card.Content description={message} />
    </Card>
  );
};
export default ShoutoutCard;
