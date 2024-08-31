import { useEffect, useState } from 'react';
import { Button, Dropdown, Checkbox } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import ResponsesPanel from './ResponsesPanel';
import LocalProgressPanel from './LocalProgressPanel';
import GlobalProgressPanel from './GlobalProgressPanel';
import { useSelf } from '../Common/FirestoreDataProvider';
import styles from './CandidateDecider.module.css';
import SearchBar from './SearchBar';
import {
  useCandidateDeciderInstance,
  useCandidateDeciderReviews
} from './useCandidateDeciderInstance';

type CandidateDeciderProps = {
  uuid: string;
};

const CandidateDecider: React.FC<CandidateDeciderProps> = ({ uuid }) => {
  const [currentCandidate, setCurrentCandidate] = useState<number>(0);
  const [showOtherVotes, setShowOtherVotes] = useState<boolean>(false);

  const userInfo = useSelf();
  const instance = useCandidateDeciderInstance(uuid);
  const [reviews, setReviews] = useCandidateDeciderReviews(uuid);

  const getRating = (candidate: number) => {
    const rating = reviews.find(
      (rt) => rt.reviewer.email === userInfo?.email && rt.candidateId === candidate
    );
    if (rating) return rating.rating;
    return 0;
  };

  const getComment = (candidate: number) => {
    const comment = reviews.find(
      (rt) => rt.reviewer.email === userInfo?.email && rt.candidateId === candidate
    );
    if (comment) return comment.comment;
    return '';
  };

  const [currentRating, setCurrentRating] = useState<Rating>();
  const [currentComment, setCurrentComment] = useState<string>();
  const [defaultCurrentRating, setDefaultCurrentRating] = useState<Rating>();
  const [defaultCurrentComment, setDefaultCurrentComment] = useState<string>();

  useEffect(() => {
    if (
      instance.candidates[currentCandidate] &&
      (currentRating === undefined || currentRating === 0) &&
      (currentComment === undefined || currentComment === '')
    ) {
      const rating = getRating(currentCandidate);
      const comment = getComment(currentCandidate);
      setCurrentRating(rating);
      setCurrentComment(comment);
      setDefaultCurrentRating(rating);
      setDefaultCurrentComment(comment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCandidate, instance.candidates, reviews]);

  const next = () => {
    if (currentCandidate === instance.candidates.length - 1) return;
    setCurrentCandidate((prev) => {
      const nextCandidate = prev + 1;
      const rating = getRating(nextCandidate);
      const comment = getComment(nextCandidate);

      setCurrentRating(rating);
      setCurrentComment(comment);
      setDefaultCurrentRating(rating);
      setDefaultCurrentComment(comment);
      return nextCandidate;
    });
  };

  const previous = () => {
    if (currentCandidate === 0) return;
    setCurrentCandidate((prev) => {
      const prevCandidate = prev - 1;
      const rating = getRating(prevCandidate);
      const comment = getComment(prevCandidate);

      setCurrentRating(rating);
      setCurrentComment(comment);
      setDefaultCurrentRating(rating);
      setDefaultCurrentComment(comment);
      return prevCandidate;
    });
  };

  const handleRatingAndCommentChange = (id: number, rating: Rating, comment: string) => {
    CandidateDeciderAPI.updateRatingAndComment(instance.uuid, id, rating, comment);
    if (userInfo) {
      setDefaultCurrentRating(rating);
      setDefaultCurrentComment(comment);
      setReviews((reviews) => [
        ...reviews.filter(
          (review) => review.candidateId !== id || review.reviewer.email !== userInfo.email
        ),
        {
          rating,
          comment,
          candidateDeciderInstanceUuid: uuid,
          candidateId: id,
          reviewer: userInfo,
          uuid: ''
        }
      ]);
    }
  };

  return instance.candidates.length === 0 ? (
    <div></div>
  ) : (
    <div className={styles.candidateDeciderContainer}>
      <div className={styles.applicationContainer}>
        <div className={styles.searchBar}>
          <SearchBar instance={instance} setCurrentCandidate={setCurrentCandidate} />
        </div>
        <div className={styles.controlsContainer}>
          <h4 className={styles.candidateIDTitle}>Candidate ID:</h4>
          <Dropdown
            compact
            value={currentCandidate}
            selection
            options={instance.candidates.map((candidate) => ({
              value: candidate.id,
              key: candidate.id,
              text: candidate.id
            }))}
            onChange={(_, data) => setCurrentCandidate(data.value as number)}
          />
          <span className={styles.ofNum}>of {instance.candidates.length}</span>
          <Button.Group className={styles.previousNextButtonContainer}>
            <Button basic color="blue" disabled={currentCandidate === 0} onClick={previous}>
              PREVIOUS
            </Button>
            <Button
              basic
              color="blue"
              disabled={currentCandidate === instance.candidates.length - 1}
              onClick={next}
            >
              NEXT
            </Button>
          </Button.Group>
          <Button
            className="ui blue button"
            disabled={
              currentComment === defaultCurrentComment && currentRating === defaultCurrentRating
            }
            onClick={() => {
              handleRatingAndCommentChange(
                currentCandidate,
                currentRating ?? 0,
                currentComment ?? ''
              );
            }}
          >
            Save
          </Button>
          <Checkbox
            className={styles.showOtherVotes}
            toggle
            checked={showOtherVotes}
            onChange={() => setShowOtherVotes((prev) => !prev)}
            label="Show other people's votes"
          />
        </div>
        <ResponsesPanel
          headers={instance.headers}
          responses={instance.candidates[currentCandidate].responses}
          currentComment={currentComment ?? ''}
          setCurrentComment={setCurrentComment}
          currentRating={currentRating ?? 0}
          setCurrentRating={setCurrentRating}
        />
      </div>
      <div className={styles.progressContainer}>
        <LocalProgressPanel
          showOtherVotes={showOtherVotes}
          candidates={instance.candidates}
          currentCandidate={currentCandidate}
          reviews={reviews}
        />
        <GlobalProgressPanel
          showOtherVotes={showOtherVotes}
          candidates={instance.candidates}
          reviews={reviews}
        />
      </div>
    </div>
  );
};

export default CandidateDecider;
