import { Dispatch, SetStateAction } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import styles from './ResponsesPanel.module.css';
import ApplicantCredentials from './ApplicantCredentials';

type Props = {
  headers: string[];
  responses: string[];
  currentRating: Rating;
  setCurrentRating: Dispatch<SetStateAction<Rating | undefined>>;
  currentComment: string;
  setCurrentComment: Dispatch<SetStateAction<string | undefined>>;
  seeApplicantName: boolean;
  candidate: number;
};

const ratings = [
  { value: 1, text: 'Strong No', color: 'red' },
  { value: 2, text: 'No', color: 'orange' },
  { value: 3, text: 'Maybe', color: 'yellow' },
  { value: 4, text: 'Yes', color: 'green' },
  { value: 5, text: 'Strong Yes', color: 'green ' },
  { value: 0, text: 'Undecided', color: 'grey' }
];

const credentialHeaders = [
  'Email Address',
  'First Name',
  'Last Name',
  'Graduation Semester',
  'NetID',
  'Link your resume',
  'Share your GitHub (optional)',
  'Share your LinkedIn (optional)',
  'Share an additional portfolio (optional)',
  'Preferred Name (if different from previous answers)'
];

type Credentials = {
  name: string;
  email: string;
  gradYear: string;
  resumeURL: string;
  githubURL?: string;
  linkedinURL?: string;
  portfolioURL?: string;
  preferredName?: string;
};

const getCredentials = (headers: string[], responses: string[]) => {
  const credentials: Credentials = {} as Credentials;
  headers.forEach((header, i) => {
    if (credentialHeaders.includes(header)) {
      switch (header) {
        case 'Email Address':
          credentials.email = responses[i];
          break;
        case 'First Name':
          credentials.name = responses[i];
          break;
        case 'Last Name':
          credentials.name += ` ${responses[i]}`;
          break;
        case 'Graduation Semester':
          credentials.gradYear = responses[i];
          break;
        case 'Link your resume':
          credentials.resumeURL = responses[i];
          break;
        case 'Share your GitHub (optional)':
          credentials.githubURL = responses[i];
          break;
        case 'Share your LinkedIn (optional)':
          credentials.linkedinURL = responses[i];
          break;
        case 'Share an additional portfolio (optional)':
          credentials.portfolioURL = responses[i];
          break;
        case 'Preferred Name (if different from previous answers)':
          credentials.preferredName = responses[i];
          break;
      }
    }
  });
  return credentials;
};

const ResponsesPanel: React.FC<Props> = ({
  headers,
  responses,
  currentRating,
  setCurrentRating,
  currentComment,
  setCurrentComment,
  seeApplicantName,
  candidate
}) => (
  <div>
    {/* <Form>
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
    </Form> */}
    <ApplicantCredentials
      {...getCredentials(headers, responses)}
      seeApplicantName={seeApplicantName}
      candidate={candidate}
    />
    {headers
      .map((header, i) => ({ header, response: responses[i] }))
      .filter(
        ({ header }) =>
          !credentialHeaders.includes(header) &&
          (seeApplicantName || header !== 'Preferred Name (optional)')
      )
      .map(({ header, response }, i) => (
        <div key={i} className={styles.questionResponseContainer}>
          <h4 className={styles.questionHeader}>{header}</h4>
          <div className={styles.responseText}>{response}</div>
        </div>
      ))}
  </div>
);

export default ResponsesPanel;
