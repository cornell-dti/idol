import { Card } from 'semantic-ui-react';
import ShoutoutCard from './ShoutoutCard';
import { Shoutout } from '../../../API/ShoutoutsAPI';

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
