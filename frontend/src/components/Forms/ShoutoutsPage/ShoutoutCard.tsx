import { Card } from 'semantic-ui-react';
import { Shoutout } from '../../../API/ShoutoutsAPI';

const ShoutoutCard = (props: Shoutout): JSX.Element => {
  const { giver, receiver, message, isAnon } = props;

  let fromString = 'From: Anonymous';
  if (!isAnon) {
    fromString = `From: ${giver?.firstName} ${giver?.lastName} (${giver.email})`;
  }

  return (
    <Card style={{ width: '100%' }}>
      <Card.Content header={`To: ${receiver}`} />
      <Card.Meta style={{ paddingLeft: '1rem', paddingBottom: '1rem' }} content={fromString} />
      <Card.Content description={message} />
    </Card>
  );
};
export default ShoutoutCard;
