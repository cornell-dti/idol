import { Card } from 'semantic-ui-react';
import styles from './ApplicantCredentials.module.css';
import { formatLink } from '../../utils';

type Props = {
  name: string;
  email: string;
  gradYear: string;
  resumeURL: string;
  githubURL?: string;
  linkedinURL?: string;
  portfolioURL?: string;
  preferredName?: string;
  seeApplicantName: boolean;
  candidate: number;
};

const ApplicantCredentials: React.FC<Props> = ({
  seeApplicantName,
  name,
  email,
  gradYear,
  resumeURL,
  githubURL,
  linkedinURL,
  portfolioURL,
  preferredName,
  candidate
}) => (
  <div className={styles.credentialContainer}>
    {seeApplicantName ? (
      <>
        <h1>
          {name} {preferredName && `(${preferredName})`}
        </h1>
        <p>{email}</p>
      </>
    ) : (
      <>
        <h1>Candidate {candidate + 1}</h1>
      </>
    )}
    <p>Class of {gradYear}</p>
    {seeApplicantName && (
      <div className={styles.iconsContainer}>
        <a
          className={styles.icon}
          href={formatLink(resumeURL)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileIcon />
        </a>
        {githubURL && (
          <a
            className={styles.icon}
            href={formatLink(githubURL)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
          </a>
        )}
        {linkedinURL && (
          <a
            className={styles.icon}
            href={formatLink(linkedinURL, 'linkedin')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon />
          </a>
        )}
        {portfolioURL && (
          <a
            className={styles.icon}
            href={formatLink(portfolioURL)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlobeIcon />
          </a>
        )}
      </div>
    )}
  </div>
);

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default ApplicantCredentials;
