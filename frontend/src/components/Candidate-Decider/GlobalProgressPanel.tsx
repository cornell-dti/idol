import { Progress } from 'semantic-ui-react';
import RatingsDisplay from './RatingsDisplay';
import styles from './ProgressPanel.module.css';

type Props = {
  showOtherVotes: boolean;
  candidates: CandidateDeciderCandidate[];
};

const GlobalProgressPanel: React.FC<Props> = ({ showOtherVotes, candidates }) => {
  const reviewers = new Set();
  let totalReviews = 0;
  candidates.forEach((candidate) =>
    candidate.ratings.forEach((rating) => {
      reviewers.add(rating.reviewer.email);
      totalReviews += 1;
    })
  );
  const allReviewers = Array.from(reviewers);
  const allRatings = candidates.map((candidate) => candidate.ratings).flat();

  return (
    <div className={styles.progressContainer}>
      <h3>Global Progress</h3>
      <Progress
        progress="ratio"
        value={totalReviews}
        total={allReviewers.length * candidates.length}
        size="tiny"
        color="blue"
      />
      <RatingsDisplay ratings={allRatings} header="Global Rating Statistics" />
      {showOtherVotes ? (
        <>
          <h3>Per-person Ratings</h3>
          {candidates.map((candidate) => (
            <RatingsDisplay ratings={candidate.ratings} header={`Candidate ${candidate.id}`} />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GlobalProgressPanel;
