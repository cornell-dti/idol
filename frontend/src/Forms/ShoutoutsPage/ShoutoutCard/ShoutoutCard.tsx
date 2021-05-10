import { Card } from 'semantic-ui-react';
import { Member } from '../../../API/MembersAPI';

type Props = {
  readonly giver: Member;
  readonly receiver: Member;
  readonly message: string;
  readonly isAnon: boolean;
};

const ShoutoutCard = ({ giver, receiver, message, isAnon }: Props): JSX.Element => (
  <Card style={{ width: '100%' }}>
    <Card.Content header={`To: ${receiver?.firstName} ${receiver?.lastName} (${receiver.email})`} />
    <Card.Meta
      style={{ paddingLeft: '1rem', paddingBottom: '1rem' }}
      content={`From: ${giver?.firstName} ${giver?.lastName} (${giver.email})`}
    />
    <Card.Content description={message} />
  </Card>
);
export default ShoutoutCard;
