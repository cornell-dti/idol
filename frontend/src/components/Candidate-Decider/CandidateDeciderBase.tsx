import { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';

const CandidateDeciderBase = () => {
  const [instances, setInstances] = useState<CandidateDeciderInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    CandidateDeciderAPI.getAllInstances()
      .then((instances) => setInstances(instances))
      .then(() => setIsLoading(false));
  }, []);
  return (
    <Card.Group>
      {instances.map((instance) => (
        <Card href={`/candidate-decider/${instance.uuid}`}>
          <Card.Content>
            <Card.Header>{instance.name}</Card.Header>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default CandidateDeciderBase;
