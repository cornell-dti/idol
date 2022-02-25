import { useEffect, useState } from 'react';
import { Form, Radio } from 'semantic-ui-react';

type Props = {
  headers: string[];
  responses: string[];
  rating: number;
  handleRatingChange: (id: number, rating: number) => void;
  comment: string;
  handleCommentChange: (id: number, comment: string) => void;
  currentCandidate: number;
};

const ratings = [
  { value: 1, text: 'No', color: 'red' },
  { value: 2, text: 'Unlikely', color: 'orange' },
  { value: 3, text: 'Maybe', color: 'yellow' },
  { value: 4, text: 'Strong Maybe', color: 'green' },
  { value: 5, text: 'Yes', color: 'green ' },
  { value: 0, text: 'Undecided', color: 'grey' }
];

const ResponsesPanel: React.FC<Props> = ({
  headers,
  responses,
  rating,
  handleRatingChange,
  currentCandidate,
  handleCommentChange,
  comment
}) => (
  <div>
    <Form>
      <Form.Group inline>
        {ratings.map((rt) => (
          <Form.Field key={rt.value}>
            <Radio
              style={{ color: rt.color }}
              label={rt.text}
              name="rating-group"
              value={rt.value}
              color={rt.color}
              checked={rt.value === rating}
              onChange={() => handleRatingChange(currentCandidate, rt.value)}
            />
          </Form.Field>
        ))}
      </Form.Group>
      <CommentEditor
        handleCommentChange={handleCommentChange}
        comment={comment}
        currentCandidate={currentCandidate}
      />
    </Form>
    {headers.map((header, i) => (
      <div key={i}>
        <h4 style={{ margin: '12px 0' }}>{header}</h4>
        <div>{responses[i]}</div>
      </div>
    ))}
  </div>
);

type CommentEditorProps = {
  comment: string;
  handleCommentChange: (id: number, comment: string) => void;
  currentCandidate: number;
};

const CommentEditor: React.FC<CommentEditorProps> = ({
  handleCommentChange,
  comment,
  currentCandidate
}) => {
  const [currentComment, setCurrentComment] = useState<string>(comment);

  useEffect(() => setCurrentComment(comment), [comment]);

  return (
    <div>
      <Form.Group inline>
        <Form.Input
          placeholder={'Comment...'}
          onChange={(_, data) => setCurrentComment(data.value)}
          value={currentComment}
        />
        <Form.Button
          onClick={() => {
            handleCommentChange(currentCandidate, currentComment);
            setCurrentComment('');
          }}
        >
          Save
        </Form.Button>
      </Form.Group>
    </div>
  );
};
export default ResponsesPanel;
