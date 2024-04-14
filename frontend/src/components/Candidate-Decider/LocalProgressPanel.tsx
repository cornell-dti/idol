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
        value={myReviews.length}
        total={candidates.length}
        size="tiny"
        color="blue"
      >{`${myReviews.length}/${candidates.length}`}</Progress>
      <RatingsDisplay ratings={myRatings} header="My Rating Statistics" />
      {showOtherVotes && userInfo?.role === 'lead' ? (
        <>
          <RatingsDisplay
            ratings={candidates[currentCandidate].ratings}
            header={`Candidate ${currentCandidate} Global Ratings`}
          />
          <div>
            <h3>All Votes on Candidate {currentCandidate}</h3>
            <div className={styles.verticalContentContainer}>
              {candidates[currentCandidate].ratings
                .filter((rating) => rating.rating !== 0)
                .map((rating) => (
                  <span
                    className={`${styles.fullWidth} ${styles.smallVerticalMargin}`}
                    key={rating.reviewer.email}
                  >{`${rating.reviewer.firstName} ${rating.reviewer.lastName}: ${ratingToString(
                    rating.rating
                  )}`}</span>
                ))}
            </div>
            <h3>All Comments on Candidate {currentCandidate}</h3>
            <div className={styles.verticalContentContainer}>
              {candidates[currentCandidate].comments.map((comment) => (
                <span
                  className={`${styles.fullWidth} ${styles.smallVerticalMargin}`}
                  key={comment.reviewer.email}
                >{`${comment.reviewer.firstName} ${comment.reviewer.lastName}: ${comment.comment}
            `}</span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LocalProgressPanel;
