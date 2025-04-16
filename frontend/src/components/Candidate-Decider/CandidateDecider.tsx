import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Checkbox, Modal, Form, Radio } from 'semantic-ui-react';
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

type CandidateDeciderProps = {
  uuid: string;
};

const ratings = [
  { value: 1, text: 'Strong No', color: 'red' },
  { value: 2, text: 'No', color: 'orange' },
  { value: 3, text: 'Maybe', color: 'yellow' },
  { value: 4, text: 'Yes', color: 'green' },
  { value: 5, text: 'Strong Yes', color: 'green ' },
  { value: 0, text: 'Undecided', color: 'grey' }
];

type CommentEditorProps = {
  currentComment: string | undefined;
  setCurrentComment: Dispatch<SetStateAction<string | undefined>>;
};

const CommentEditor: React.FC<CommentEditorProps> = ({ currentComment, setCurrentComment }) => (
  <div style={{ width: '100%' }}>
    <h4>Comments</h4>
    <Form.Group inline>
      <Form.Input
        style={{ height: 256, width: '100%' }}
        className="fifteen wide field"
        placeholder={'Comment...'}
        onChange={(event) => setCurrentComment(event.target.value)}
        value={currentComment}
      />
    </Form.Group>
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
  const hasAdminPermission = useHasAdminPermission();

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
            variant="negative"
          />
          <Button
            label="Discard"
            onClick={() => {
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

            <Form>
              <Form.Group inline>
                {ratings.map((rt) => (
                  <Form.Field key={rt.value}>
                    <Radio
                      label={rt.text}
                      name="rating-group"
                      value={rt.value}
                      color={rt.color}
                      checked={rt.value === currentRating}
                      onClick={() => setCurrentRating(rt.value as Rating)}
                    />
                  </Form.Field>
                ))}
              </Form.Group>
            </Form>
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
        {hasAdminPermission && (
          <Checkbox
            className={styles.seeApplicantName}
            toggle
            checked={seeApplicantName}
            onChange={() => setSeeApplicantName((prev) => !prev)}
            label="See applicant name"
          />
        )}
        <ResponsesPanel
          headers={instance.headers}
          responses={instance.candidates[currentCandidate].responses}
          currentComment={currentComment ?? ''}
          setCurrentComment={setCurrentComment}
          currentRating={currentRating ?? 0}
          setCurrentRating={setCurrentRating}
          seeApplicantName={seeApplicantName}
          candidate={instance.candidates[currentCandidate].id}
        />
      </div>
    </div>
  );
};

export default CandidateDecider;
