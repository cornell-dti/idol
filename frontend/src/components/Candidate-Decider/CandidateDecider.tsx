import { useState, useEffect } from 'react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import ResponsesPanel from './ResponsesPanel';
import { Button, Dropdown, Form, Radio } from 'semantic-ui-react';

type CandidateDeciderProps = {
  uuid: string;
};

const ratings = [
  { value: 1, text: 'No', color: 'red' },
  { value: 2, text: 'Unlikely', color: 'orange' },
  { value: 3, text: 'Maybe', color: 'yellow' },
  { value: 4, text: 'Strong Maybe', color: 'green' },
  { value: 5, text: 'Yes', color: 'green ' },
  { value: 0, text: 'Undecided', color: 'grey' }
];

const CandidateDecider: React.FC<CandidateDeciderProps> = ({ uuid }) => {
  const [candidates, setCandidates] = useState<CandidateDeciderCandidate[]>([]);
  const [name, setName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCandidate, setCurrentCandidate] = useState<number>(0);

  useEffect(() => {
    CandidateDeciderAPI.getInstance(uuid)
      .then((instance) => {
        console.log(instance);
        setCandidates(instance.candidates);
        setName(instance.name);
        setHeaders(instance.headers);
      })
      .then(() => setIsLoading(false));
  }, []);
  return isLoading ? (
    <div></div>
  ) : (
    <div style={{ padding: '2%' }}>
      <div style={{ display: 'flex' }}>
        <h4>Candidate ID:</h4>
        <Dropdown
          value={currentCandidate}
          selection
          options={candidates.map((candidate) => ({
            value: candidate.id,
            key: candidate.id,
            text: candidate.id
          }))}
          onChange={(_, data) => setCurrentCandidate(data.value as number)}
        />
        <span>of {candidates.length}</span>
        <Button.Group>
          <Button
            basic
            color="blue"
            disabled={currentCandidate === 0}
            onClick={() => setCurrentCandidate((prev) => prev - 1)}
          >
            PREVIOUS
          </Button>
          <Button
            basic
            color="blue"
            disabled={currentCandidate === candidates.length - 1}
            onClick={() => setCurrentCandidate((prev) => prev + 1)}
          >
            NEXT
          </Button>
        </Button.Group>
      </div>
      <Form inline>
        <Form.Group inline>
          {ratings.map((rating) => (
            <Form.Field>
              <Radio
                style={{ color: rating.color }}
                label={rating.text}
                name="rating-group"
                value={rating.value}
                color={rating.color}
              />
            </Form.Field>
          ))}
        </Form.Group>
      </Form>
      <ResponsesPanel headers={headers} responses={candidates[currentCandidate].responses} />
    </div>
  );
};

export default CandidateDecider;
