import { LEAD_ROLES } from 'common-types/constants';
import styles from './ProgressPanel.module.css';
import { useSelf } from '../Common/FirestoreDataProvider';
// import RatingsDisplay from './RatingsDisplay';
import { ratingToString } from './ratings-utils';
import ProgressBar from '../Common/ProgressBar/ProgressBar';

type ProgressPanelProps = {
  candidates: CandidateDeciderCandidate[];
  currentCandidate: number;
  reviews: CandidateDeciderReview[];
};

const LocalProgressPanel: React.FC<ProgressPanelProps> = ({
  candidates,
  currentCandidate,
  reviews
}) => {
  const userInfo = useSelf();

  const myRatings = reviews.filter((review) => review.reviewer.email === userInfo?.email);
  const currentCandidateReviews = reviews.filter(
    (review) => review.candidateId === currentCandidate
  );
  return (
    <div className={styles.progressContainer}>
      <ProgressBar value={myRatings.length} total={candidates.length} />

      {userInfo && LEAD_ROLES.includes(userInfo.role) ? (
        <>
          {/* <RatingsDisplay
            ratings={currentCandidateReviews}
            header={`Candidate ${currentCandidate + 1} Global Ratings`}
          /> */}
          <div>
            <h3>All Votes on Candidate {currentCandidate + 1}</h3>
            <div className={styles.verticalContentContainer}>
              {currentCandidateReviews
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
            <h3>All Comments on Candidate {currentCandidate + 1}</h3>
            <div className={styles.verticalContentContainer}>
              {currentCandidateReviews.map((review) => (
                <span
                  className={`${styles.fullWidth} ${styles.smallVerticalMargin}`}
                  key={review.reviewer.email}
                >{`${review.reviewer.firstName} ${review.reviewer.lastName}: ${review.comment}
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
