import { Card } from 'semantic-ui-react';
import ShoutoutCard from './ShoutoutCard';

const ShoutoutList = (props: { shoutouts: Shoutout[] }): JSX.Element => {
  const { shoutouts } = props;
  return (
    <Card.Group>
      {shoutouts.map((shoutout, i) => (
        <ShoutoutCard key={i} {...shoutout} />
      ))}
    </Card.Group>
  );
};

export default ShoutoutList;
