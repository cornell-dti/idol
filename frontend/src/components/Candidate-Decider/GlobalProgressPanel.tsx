import { Progress } from 'semantic-ui-react';
import RatingsDisplay from './RatingsDisplay';
import styles from './ProgressPanel.module.css';

type Props = {
  showOtherVotes: boolean;
  candidates: CandidateDeciderCandidate[];
  reviews: CandidateDeciderReview[];
};

const GlobalProgressPanel: React.FC<Props> = ({ showOtherVotes, candidates, reviews }) => {
  const reviewers = new Set();
  reviews.forEach((review) => reviewers.add(review.reviewer.email));
  const allReviewers = Array.from(reviewers);

  return (
    <div className={styles.progressContainer}>
      <h3>Global Progress</h3>
      <Progress
        value={reviews.length}
        total={allReviewers.length * candidates.length}
        size="tiny"
        color="blue"
      >{`${reviews.length}/${candidates.length * allReviewers.length}`}</Progress>
      <RatingsDisplay ratings={reviews} header="Global Rating Statistics" />
      {showOtherVotes ? (
        <>
          <h3>Per-person Ratings</h3>
          {candidates.map((candidate) => (
            <RatingsDisplay
              ratings={reviews.filter((review) => review.candidateId === candidate.id)}
              header={`Candidate ${candidate.id + 1}`}
              key={candidate.id}
            />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GlobalProgressPanel;
