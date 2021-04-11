import { Card, Message } from 'semantic-ui-react';
import ShoutoutCard from '../ShoutoutCard/ShoutoutCard';
import { Shoutout } from '../ShoutoutsPage';

const ShoutoutList = (props: {
  shoutouts?: Shoutout[];
  emptyMessage: string;
}): JSX.Element => {
  const { shoutouts, emptyMessage } = props;
  return (
    <div>
      {shoutouts ? (
        <Card.Group>
          {shoutouts.map((shoutout, i) => (
            <ShoutoutCard key={i} {...shoutout} />
          ))}
        </Card.Group>
      ) : (
        <Message>{emptyMessage}</Message>
      )}
    </div>
  );
};

export default ShoutoutList;
