import { useEffect, useState } from 'react';
import { Button, Dropdown, Checkbox } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import ResponsesPanel from './ResponsesPanel';
import LocalProgressPanel from './LocalProgressPanel';
import GlobalProgressPanel from './GlobalProgressPanel';
import { useSelf } from '../Common/FirestoreDataProvider';
import styles from './CandidateDecider.module.css';
import SearchBar from './SearchBar';
import useCandidateDeciderInstance from './useCandidateDeciderInstance';

type CandidateDeciderProps = {
  uuid: string;
};

const CandidateDecider: React.FC<CandidateDeciderProps> = ({ uuid }) => {
  const [currentCandidate, setCurrentCandidate] = useState<number>(0);
  const [showOtherVotes, setShowOtherVotes] = useState<boolean>(false);

  const userInfo = useSelf();
  const [instance, setInstance] = useCandidateDeciderInstance(uuid);

  const getRating = (candidate: number) => {
    const rating = instance.candidates[candidate].ratings.find(
      (rt) => rt.reviewer.email === userInfo?.email
    );
    if (rating) return rating.rating;
    return 0;
  };

  const getComment = (candidate: number) => {
    const comment = instance.candidates[candidate].comments.find(
      (cmt) => cmt.reviewer.email === userInfo?.email
    );
    if (comment) return comment.comment;
    return '';
  };

  const [currentRating, setCurrentRating] = useState<Rating>();
  const [currentComment, setCurrentComment] = useState<string>();

  useEffect(() => {
    // Only set the currentRating and currentComment once when the instance first loads in
    if (
      instance.candidates[currentCandidate] &&
      currentRating === undefined &&
      currentComment === undefined
    ) {
      setCurrentRating(getRating(currentCandidate));
      setCurrentComment(getComment(currentCandidate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCandidate, instance.candidates]);

  const next = () => {
    if (currentCandidate === instance.candidates.length - 1) return;
    setCurrentCandidate((prev) => {
      const nextCandidate = prev + 1;
      setCurrentRating(getRating(nextCandidate));
      setCurrentComment(getComment(nextCandidate));
      return nextCandidate;
    });
  };

  const previous = () => {
    if (currentCandidate === 0) return;
    setCurrentCandidate((prev) => {
      const prevCandidate = prev - 1;
      setCurrentRating(getRating(prevCandidate));
      setCurrentComment(getComment(prevCandidate));
      return prevCandidate;
    });
  };

  const handleRatingAndCommentChange = (id: number, rating: Rating, comment: string) => {
    CandidateDeciderAPI.updateRatingAndComment(instance.uuid, id, rating, comment);
    if (userInfo) {
      setInstance((instance) => ({
        ...instance,
        candidates: instance.candidates.map((candidate) =>
          candidate.id === id
            ? {
                ...candidate,
                ratings: candidate.ratings.find(
                  (currRating) => currRating.reviewer.email === userInfo.email
                )
                  ? candidate.ratings.map((currRating) =>
                      currRating.reviewer.email === userInfo.email
                        ? { rating, reviewer: userInfo }
                        : currRating
                    )
                  : [...candidate.ratings, { rating, reviewer: userInfo }],
                comments: candidate.comments.find(
                  (currComment) => currComment.reviewer.email === userInfo.email
                )
                  ? candidate.comments.map((currComment) =>
                      currComment.reviewer.email === userInfo.email
                        ? { comment, reviewer: userInfo }
                        : currComment
                    )
                  : [...candidate.comments, { comment, reviewer: userInfo }]
              }
            : candidate
        )
      }));
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
              currentComment === getComment(currentCandidate) &&
              currentRating === getRating(currentCandidate)
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
        />
        <GlobalProgressPanel showOtherVotes={showOtherVotes} candidates={instance.candidates} />
      </div>
    </div>
  );
};

export default CandidateDecider;
