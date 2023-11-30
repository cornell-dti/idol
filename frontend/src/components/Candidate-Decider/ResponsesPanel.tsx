import { Dispatch, SetStateAction } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import styles from './ResponsesPanel.module.css';

type Props = {
  headers: string[];
  responses: string[];
  currentRating: Rating;
  setCurrentRating: Dispatch<SetStateAction<Rating | undefined>>;
  currentComment: string;
  setCurrentComment: Dispatch<SetStateAction<string | undefined>>;
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
  currentRating,
  setCurrentRating,
  currentComment,
  setCurrentComment
}) => (
  <div>
    <Form>
      <Form.Group inline>
        {ratings.map((rt) => (
          <Form.Field key={rt.value}>
            <Radio
              label={rt.text}
              name="rating-group"
              value={rt.value}
              color={rt.color}
              checked={rt.value === currentRating}
              onClick={() => setCurrentRating(rt.value as Rating)}
            />
          </Form.Field>
        ))}
      </Form.Group>
      <CommentEditor currentComment={currentComment} setCurrentComment={setCurrentComment} />
    </Form>
    {headers.map((header, i) => (
      <div key={i} className={styles.questionResponseContainer}>
        <h4 className={styles.questionHeader}>{header}</h4>
        <div>{responses[i]}</div>
      </div>
    ))}
  </div>
);

type CommentEditorProps = {
  currentComment: string;
  setCurrentComment: Dispatch<SetStateAction<string | undefined>>;
};

const CommentEditor: React.FC<CommentEditorProps> = ({ currentComment, setCurrentComment }) => (
  <div>
    <Form.Group inline>
      <Form.Input
        className="fifteen wide field"
        placeholder={'Comment...'}
        onChange={(_, data) => setCurrentComment(data.value)}
        value={currentComment}
      />
    </Form.Group>
  </div>
);
export default ResponsesPanel;
