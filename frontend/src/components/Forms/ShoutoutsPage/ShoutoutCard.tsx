import { Card } from 'semantic-ui-react';
import { Member } from '../../../API/MembersAPI';

type Props =
  | {
      readonly giver: Member;
      readonly receiver: Member;
      readonly message: string;
      readonly isAnon: false;
    }
  | {
      readonly receiver: Member;
      readonly message: string;
      readonly isAnon: true;
    };

const ShoutoutCard = (props: Props): JSX.Element => {
  const { receiver, message } = props;

  let fromString;
  if ('giver' in props) {
    const { giver } = props;
    fromString = `From: ${giver?.firstName} ${giver?.lastName} (${giver.email})`;
  } else {
    fromString = 'From: Anonymous';
  }

  return (
    <Card style={{ width: '100%' }}>
      <Card.Content
        header={`To: ${receiver?.firstName} ${receiver?.lastName} (${receiver.email})`}
      />
      <Card.Meta style={{ paddingLeft: '1rem', paddingBottom: '1rem' }} content={fromString} />
      <Card.Content description={message} />
    </Card>
  );
};
export default ShoutoutCard;
