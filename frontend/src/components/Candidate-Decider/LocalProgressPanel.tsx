import { LEAD_ROLES } from 'common-types/constants';
import styles from './ProgressPanel.module.css';
import { useMembers, useSelf } from '../Common/FirestoreDataProvider';
// import RatingsDisplay from './RatingsDisplay';
import { ratingToString } from './ratings-utils';
import ProgressBar from '../Common/ProgressBar/ProgressBar';

type ProgressPanelProps = {
  candidates: CandidateDeciderCandidate[];
  currentCandidate: number;
  reviews: CandidateDeciderReview[];
  authorizedMembers: IdolMember[];
};

const LocalProgressPanel: React.FC<ProgressPanelProps> = ({
  candidates,
  currentCandidate,
  reviews,
  authorizedMembers
}) => {
  const userInfo = useSelf();
  const allLeads = useMembers().filter((member) => LEAD_ROLES.includes(member.role));
  // Count only the team's leads if an admin added them to this instance, otherwise all leads
  const teamLeads = authorizedMembers.filter((member) => LEAD_ROLES.includes(member.role));
  const countedLeads = teamLeads.length > 0 ? teamLeads : allLeads;

  const myRatings = reviews.filter((review) => review.reviewer.email === userInfo?.email);
  const currentCandidateReviews = reviews.filter(
    (review) => review.candidateId === currentCandidate
  );
  const leadVotes = currentCandidateReviews.filter((review) =>
    countedLeads.some((lead) => lead.email === review.reviewer.email)
  ).length;
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
            <h3>
              Lead Votes on Candidate {currentCandidate + 1}: {leadVotes}/{countedLeads.length}
            </h3>
            <p>Number of leads who have voted on this candidate.</p>
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
