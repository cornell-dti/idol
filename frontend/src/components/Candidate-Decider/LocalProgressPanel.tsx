import { Progress } from 'semantic-ui-react';
import styles from './ProgressPanel.module.css';
import { useSelf } from '../Common/FirestoreDataProvider';
import RatingsDisplay from './RatingsDisplay';
import { ratingToString } from './ratings-utils';

type ProgressPanelProps = {
  showOtherVotes: boolean;
  candidates: CandidateDeciderCandidate[];
  currentCandidate: number;
};

const LocalProgressPanel: React.FC<ProgressPanelProps> = ({
  showOtherVotes,
  candidates,
  currentCandidate
}) => {
  const userInfo = useSelf();

  const myReviews = candidates.filter((candidate) =>
    candidate.ratings.some((rating) => rating.reviewer.email === userInfo?.email)
  );
  const myRatings = myReviews.map(
    (candidate) =>
      candidate.ratings.find(
        (rating) => rating.reviewer.email === userInfo?.email
      ) as CandidateDeciderRating
  );
  return (
    <div className={styles.progressContainer}>
      <h3>My Progress</h3>
      <Progress
        progress="ratio"
        value={myReviews.length}
        total={candidates.length}
        size="tiny"
        color="blue"
      />
      <RatingsDisplay ratings={myRatings} header="My Rating Statistics" />
      {showOtherVotes ? (
        <>
          <RatingsDisplay
            ratings={candidates[currentCandidate].ratings}
            header={`Candidate ${currentCandidate} Global Ratings`}
          />
          <h3>All Votes on Candidate {currentCandidate}</h3>
          {candidates[currentCandidate].ratings
            .filter((rating) => rating.rating !== 0)
            .map((rating) => (
              <span>{`${rating.reviewer.firstName} ${rating.reviewer.lastName}: ${ratingToString(
                rating.rating
              )}`}</span>
            ))}
          <h3>All Comments on Candidate {currentCandidate}</h3>
          {candidates[currentCandidate].comments.map((comment) => (
            <span>{`${comment.reviewer.firstName} ${comment.reviewer.lastName}: ${comment.comment}
            `}</span>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LocalProgressPanel;
