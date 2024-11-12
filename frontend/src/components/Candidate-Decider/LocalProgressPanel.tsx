import { Progress } from 'semantic-ui-react';
import styles from './ProgressPanel.module.css';
import { useSelf } from '../Common/FirestoreDataProvider';
import RatingsDisplay from './RatingsDisplay';
import { ratingToString } from './ratings-utils';
import { LEAD_ROLES } from '../../consts';

type ProgressPanelProps = {
  showOtherVotes: boolean;
  candidates: CandidateDeciderCandidate[];
  currentCandidate: number;
  reviews: CandidateDeciderReview[];
};

const LocalProgressPanel: React.FC<ProgressPanelProps> = ({
  showOtherVotes,
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
      <h3>My Progress</h3>
      <Progress
        value={myRatings.length}
        total={candidates.length}
        size="tiny"
        color="blue"
      >{`${myRatings.length}/${candidates.length}`}</Progress>
      <RatingsDisplay ratings={myRatings} header="My Rating Statistics" />
      {showOtherVotes && userInfo && LEAD_ROLES.includes(userInfo.role) ? (
        <>
          <RatingsDisplay
            ratings={currentCandidateReviews}
            header={`Candidate ${currentCandidate} Global Ratings`}
          />
          <div>
            <h3>All Votes on Candidate {currentCandidate}</h3>
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
            <h3>All Comments on Candidate {currentCandidate}</h3>
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
