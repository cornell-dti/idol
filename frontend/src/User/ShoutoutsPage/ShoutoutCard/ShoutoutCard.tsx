import { Card } from 'semantic-ui-react';

type Props = {
  readonly shoutoutGiverEmail: string;
  readonly shoutoutRecipientEmail: string;
  readonly message: string;
};

const ShoutoutCard = ({
  shoutoutGiverEmail,
  shoutoutRecipientEmail,
  message
}: Props): JSX.Element => (
  <Card style={{ width: '100%' }}>
    <Card.Content header={`To: ${shoutoutRecipientEmail}`} />
    <Card.Meta
      style={{ paddingLeft: '1rem' }}
      content={`From: ${shoutoutGiverEmail}`}
    />
    <Card.Content description={message} />
  </Card>
);

export default ShoutoutCard;
