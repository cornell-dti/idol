import { Card } from 'semantic-ui-react';
import ShoutoutCard from './ShoutoutCard';

const ShoutoutList = (props: {
  shoutouts: Shoutout[];
  setGivenShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
}): JSX.Element => {
  const { shoutouts, setGivenShoutouts } = props;
  return (
    <Card.Group>
      {shoutouts.map((shoutout, i) => (
        <ShoutoutCard key={i} shoutout={shoutout} setGivenShoutouts={setGivenShoutouts} />
      ))}
    </Card.Group>
  );
};

export default ShoutoutList;
