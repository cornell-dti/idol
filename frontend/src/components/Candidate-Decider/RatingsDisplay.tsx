import { Progress } from 'semantic-ui-react';
import styled from 'styled-components';
import { ratingToString, ratingToColor } from './ratings-utils';
import styles from './ProgressPanel.module.css';

type Props = {
  ratings: CandidateDeciderRating[];
  header: string;
};

const groupRatings = (ratings: CandidateDeciderRating[]): Map<number, number> => {
  const count = new Map<number, number>();
  ratings.forEach((rating) => {
    if (rating.rating === 0) return;
    const currentValue = count.get(rating.rating);
    if (currentValue) count.set(rating.rating, currentValue + 1);
    else count.set(rating.rating, 1);
  });
  return count;
};

const StyledProgressBar = styled(Progress)`
  background: transparent !important;
  margin: 0.5em !important;
`;

const RatingsDisplay: React.FC<Props> = ({ ratings, header }) => {
  const counts = groupRatings(ratings);
  const allRatings: Rating[] = [1, 2, 3, 4, 5, 6];
  return (
    <div className={styles.statisticsList}>
      <h3>{header}</h3>
      {allRatings.map((rating) => (
        <div className={styles.ratingProgressContainer}>
          <div className={styles.ratingProgressLabel}>
            {ratingToString(rating)} ({counts.get(rating) || 0})
          </div>
          <StyledProgressBar
            className={styles.percentageBar}
            value={counts.get(rating)}
            total={ratings.length}
            color={ratingToColor(rating)}
            size="tiny"
          />
        </div>
      ))}
    </div>
  );
};

export default RatingsDisplay;
