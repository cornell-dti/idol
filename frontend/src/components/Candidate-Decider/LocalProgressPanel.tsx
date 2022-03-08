import { Progress } from 'semantic-ui-react';
import styles from './ProgressPanel.module.css';
import { useSelf } from '../Common/FirestoreDataProvider';

type ProgressPanelProps = {
  showOtherVotes: boolean;
  candidates: CandidateDeciderCandidate[];
};

const LocalProgressPanel: React.FC<ProgressPanelProps> = ({ showOtherVotes, candidates }) => {
  const userInfo = useSelf();

  const myReviews = candidates.filter((candidate) =>
    candidate.ratings.some((rating) => rating.reviewer === userInfo)
  );
  return (
    <div className={styles.progressContainer}>
      <h3>My Progress</h3>
      <Progress value={myReviews.length} total={candidates.length} size="tiny" color="blue" />;
      <h3>My Rating Statistics</h3>
    </div>
  );
};

export default LocalProgressPanel;
