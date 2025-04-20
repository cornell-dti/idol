import { Dispatch, SetStateAction } from 'react';
import styles from './ResponsesPanel.module.css';
import ApplicantCredentials from './ApplicantCredentials';
import { ChevronDown } from 'lucide-react';

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
const ResponsesPanel: React.FC<Props> = ({ headers, responses, seeApplicantName, candidate }) => (
  <div>
    <ApplicantCredentials
      {...getCredentials(headers, responses)}
      seeApplicantName={seeApplicantName}
      candidate={candidate}
    />

    <div className={styles.applicantResponses}>
      <h3>Questions</h3>

      <div className={styles.accordionsWrapper}>
        {headers
          .map((header, i) => ({ header, response: responses[i] }))
          .filter(
            ({ header }) =>
              !credentialHeaders.includes(header) &&
              (seeApplicantName || header !== 'Preferred Name (optional)')
          )
          .map(({ header, response }, i) => (
            <details key={i} className={styles.accordionItem} open={i === 0}>
              <summary className={styles.accordionSummary}>
                <h4>{header}</h4>
                <ChevronDown />
              </summary>
              <div className={styles.accordionContent}>
                <p>{response}</p>
              </div>
            </details>
          ))}
      </div>
    </div>
  </div>
);

export default ResponsesPanel;
