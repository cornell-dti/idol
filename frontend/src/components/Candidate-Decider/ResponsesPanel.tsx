import { Dispatch, SetStateAction } from 'react';
import styles from './ResponsesPanel.module.css';
import ApplicantCredentials from './ApplicantCredentials';
import Accordion from '../Common/Accordion/Accordion';

type Props = {
  headers: string[];
  responses: string[];
  currentRating: Rating;
  setCurrentRating: Dispatch<SetStateAction<Rating | undefined>>;
  currentComment: string;
  setCurrentComment: Dispatch<SetStateAction<string | undefined>>;
  seeApplicantName: boolean;
  candidate: number;
  toggleSeeApplicantName?: () => void;
  canToggleSeeApplicantName?: boolean;
};

const credentialHeaders = [
  'Email Address',
  'First name',
  'Last name',
  'Graduation year',
  'NetID',
  'Please attach your resume in PDF format.',
  'Share your GitHub (optional)',
  'Share your LinkedIn (optional)',
  'Share an additional portfolio (optional)',
  'Preferred name (optional)'
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
        case 'First name':
          credentials.name = responses[i];
          break;
        case 'Last name':
          credentials.name += ` ${responses[i]}`;
          break;
        case 'Graduation year':
          credentials.gradYear = responses[i];
          break;
        case 'Please attach your resume in PDF format.':
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
        case 'Preferred name (optional)':
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
  seeApplicantName,
  candidate,
  toggleSeeApplicantName,
  canToggleSeeApplicantName
}) => (
  <div>
    <ApplicantCredentials
      {...getCredentials(headers, responses)}
      seeApplicantName={seeApplicantName}
      toggleSeeApplicantName={toggleSeeApplicantName}
      canToggleSeeApplicantName={canToggleSeeApplicantName}
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
            <Accordion key={i} header={header} response={response} defaultOpen={true} />
          ))}
      </div>
    </div>
  </div>
);

export default ResponsesPanel;
