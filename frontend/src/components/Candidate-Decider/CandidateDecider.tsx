import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Modal } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import ResponsesPanel from './ResponsesPanel';
import LocalProgressPanel from './LocalProgressPanel';
import { useHasAdminPermission, useSelf } from '../Common/FirestoreDataProvider';
import styles from './CandidateDecider.module.css';
import SearchBar from './SearchBar';
import {
  useCandidateDeciderInstance,
  useCandidateDeciderReviews
} from './useCandidateDeciderInstance';
import Button from '../Common/Button/Button';
import Input from '../Common/Input/Input';
import Selector, { RatingOptions } from '../Common/Selector/Selector';

type CandidateDeciderProps = {
  uuid: string;
};

const ratings: RatingOptions[] = [
  { value: 1, text: 'Strong No', color: 'red' },
  { value: 2, text: 'No', color: 'orange' },
  { value: 3, text: 'Lean No', color: 'yellow' },
  { value: 4, text: 'Lean Yes', color: 'lightgreen' },
  { value: 5, text: 'Yes', color: 'green' },
  { value: 6, text: 'Strong Yes', color: 'darkgreen' },
  { value: 0, text: 'Undecided', color: 'gray' }
];

type CommentEditorProps = {
  currentComment: string | undefined;
  setCurrentComment: Dispatch<SetStateAction<string | undefined>>;
};

const CommentEditor: React.FC<CommentEditorProps> = ({ currentComment, setCurrentComment }) => (
  <div className={styles.commentEditor}>
    <h4>Comments</h4>
    <Input
      value={currentComment}
      onChange={(event) => setCurrentComment(event.target.value)}
      placeholder="Comment..."
      multiline
      maxHeight={256}
    />
  </div>
);

const CandidateDecider: React.FC<CandidateDeciderProps> = ({ uuid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextCandidate, setNextCandidate] = useState<number | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<number>(0);
  const [seeApplicantName, setSeeApplicantName] = useState<boolean>(false);

  const userInfo = useSelf();
  const instance = useCandidateDeciderInstance(uuid);
  const [reviews, setReviews] = useCandidateDeciderReviews(uuid);

  const getRating = (candidate: number) => {
    const rating = reviews.find(
      (rt) => rt.reviewer.email === userInfo?.email && rt.candidateId === candidate
    );
    return rating ? rating.rating : undefined;
  };

  const getComment = (candidate: number) => {
    const comment = reviews.find(
      (rt) => rt.reviewer.email === userInfo?.email && rt.candidateId === candidate
    );
    if (comment) return comment.comment;
    return undefined;
  };

  const [currentRating, setCurrentRating] = useState<Rating>();
  const [currentComment, setCurrentComment] = useState<string>();
  const [defaultCurrentRating, setDefaultCurrentRating] = useState<Rating>();
  const [defaultCurrentComment, setDefaultCurrentComment] = useState<string>();

  const isSaved =
    currentComment === defaultCurrentComment && currentRating === defaultCurrentRating;

  const populateReviewForCandidate = (candidate: number) => {
    const rating = getRating(candidate) ?? 0;
    const comment = getComment(candidate) ?? '';
    setCurrentRating(rating);
    setCurrentComment(comment);
    setDefaultCurrentRating(rating);
    setDefaultCurrentComment(comment);
  };

  const completedReviews = reviews.filter((review) => review.rating !== 0);

  useEffect(() => {
    if (
      instance.candidates[currentCandidate] &&
      currentRating === undefined &&
      currentComment === undefined
    ) {
      populateReviewForCandidate(currentCandidate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCandidate, instance.candidates, reviews]);

  const handleRatingAndCommentChange = (id: number, rating: Rating, comment: string) => {
    CandidateDeciderAPI.updateRatingAndComment(instance.uuid, id, rating, comment);
    if (userInfo) {
      setCurrentRating(rating);
      setCurrentComment(comment);
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

  const handleCandidateChange = (candidate: number) => {
    if (candidate < 0 || candidate >= instance.candidates.length) {
      return;
    }
    if (!isSaved) {
      setNextCandidate(candidate);
      setIsModalOpen(true);
    } else {
      setCurrentCandidate(candidate);
      populateReviewForCandidate(candidate);
    }
  };

  const navigateToNextCandidate = (candidate: number) => {
    setCurrentCandidate(candidate);
    populateReviewForCandidate(candidate);
    setNextCandidate(null);
    setIsModalOpen(false);
  };

  const hasAdminPermission = useHasAdminPermission();

  return instance.candidates.length === 0 ? (
    <div></div>
  ) : (
    <div className={styles.candidateDeciderContainer}>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} size="small">
        <Modal.Header>Don't Forget To Save!</Modal.Header>
        <Modal.Content>
          <p>You have unsaved changes. Do you want to save them before navigating?</p>
        </Modal.Content>
        <Modal.Actions className={styles.modalActions}>
          <Button
            label="Cancel"
            onClick={() => {
              setIsModalOpen(false);
            }}
            variant="default"
          />
          <Button
            label="Discard"
            onClick={() => {
              if (nextCandidate !== null) {
                navigateToNextCandidate(nextCandidate);
              }
            }}
            variant="negative"
          />
          <Button
            label="Save"
            onClick={() => {
              handleRatingAndCommentChange(
                currentCandidate,
                currentRating ?? 0,
                currentComment ?? ''
              );
              if (nextCandidate !== null) {
                navigateToNextCandidate(nextCandidate);
              }
            }}
            variant="primary"
          />
        </Modal.Actions>
      </Modal>
      <div className={styles.leftColumn}>
        <div className={styles.top}>
          <div className={styles.navigation}>
            <div className={styles.progressContainer}>
              <LocalProgressPanel
                candidates={instance.candidates}
                currentCandidate={currentCandidate}
                reviews={completedReviews}
              />
            </div>

            <div className={styles.searchBar}>
              <Button
                label="Previous"
                disabled={currentCandidate === 0}
                onClick={() => {
                  handleCandidateChange(currentCandidate - 1);
                }}
                variant="default"
              />
              <SearchBar
                instance={instance}
                setCurrentCandidate={(candidate) => {
                  handleCandidateChange(candidate);
                }}
                currentCandidate={currentCandidate}
                seeApplicantName={seeApplicantName}
              />
              <Button
                label="Next"
                disabled={currentCandidate === instance.candidates.length - 1}
                onClick={() => {
                  handleCandidateChange(currentCandidate + 1);
                }}
                variant="default"
              />
            </div>
          </div>
          <div className={styles.commentEditorWrapper}>
            <CommentEditor currentComment={currentComment} setCurrentComment={setCurrentComment} />
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.ratingSelectorWrapper}>
            <h4>Final selection</h4>
            <Selector
              selected={currentRating ?? 0}
              onChange={(value: number) => setCurrentRating(value as Rating)}
              ratings={ratings}
            />
          </div>
          <div className={styles.saveButtonWrapper}>
            <Button
              label="Save"
              disabled={isSaved}
              onClick={() => {
                handleRatingAndCommentChange(
                  currentCandidate,
                  currentRating ?? 0,
                  currentComment ?? ''
                );
              }}
              variant="primary"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.responsesContainer}>
        <ResponsesPanel
          headers={instance.headers}
          responses={instance.candidates[currentCandidate].responses}
          currentComment={currentComment ?? ''}
          setCurrentComment={setCurrentComment}
          currentRating={currentRating ?? 0}
          setCurrentRating={setCurrentRating}
          seeApplicantName={seeApplicantName}
          toggleSeeApplicantName={() => setSeeApplicantName((prev) => !prev)}
          canToggleSeeApplicantName={hasAdminPermission}
          candidate={instance.candidates[currentCandidate].id}
        />
      </div>
    </div>
  );
};

export default CandidateDecider;
