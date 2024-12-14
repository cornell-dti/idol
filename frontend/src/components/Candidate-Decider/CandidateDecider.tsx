import { useEffect, useState } from 'react';
import { Button, Dropdown, Checkbox, Modal } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import ResponsesPanel from './ResponsesPanel';
import LocalProgressPanel from './LocalProgressPanel';
import GlobalProgressPanel from './GlobalProgressPanel';
import { useHasAdminPermission, useSelf } from '../Common/FirestoreDataProvider';
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
  const [isSaved, setIsSaved] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isBypassingModal, setIsBypassingModal] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<'next' | 'previous' | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<number>(0);
  const [showOtherVotes, setShowOtherVotes] = useState<boolean>(false);

  const userInfo = useSelf();
  const instance = useCandidateDeciderInstance(uuid);
  const [reviews, setReviews] = useCandidateDeciderReviews(uuid);
  const hasAdminPermission = useHasAdminPermission();

  const getRating = (candidate: number) => {
    const rating = reviews.find(
      (rt) => rt.reviewer.email === userInfo?.email && rt.candidateId === candidate
    );
    if (rating) return rating.rating;
    return undefined;
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

  const populateReviewForCandidate = (candidate: number) => {
    const rating = getRating(candidate);
    const comment = getComment(candidate);
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

  const next = (force = false) => {
    if (!force && !isSaved && !isBypassingModal) {
      setNavigationDirection('next');
      setIsOpen(true);
      return;
    }
    setIsBypassingModal(false);
    if (currentCandidate === instance.candidates.length - 1) return;
    setCurrentCandidate((prev) => {
      const nextCandidate = prev + 1;
      populateReviewForCandidate(nextCandidate);
      return nextCandidate;
    });
  };

  const previous = (force = false) => {
    if (!force && !isBypassingModal) {
      setNavigationDirection('previous');
      setIsOpen(true);
      return;
    }
    setIsBypassingModal(false);
    if (currentCandidate === 0) return;
    setCurrentCandidate((prev) => {
      const prevCandidate = prev - 1;
      populateReviewForCandidate(prevCandidate);
      return prevCandidate;
    });
  };

  const confirmNavigation = (direction: 'next' | 'previous') => {
    setIsOpen(false);
    setIsBypassingModal(true);
    setTimeout(() => {
      if (direction === 'next') next(true);
      else previous(true);
    }, 0);
  };

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
      setIsSaved(true);
    }
  };

  useEffect(() => {
    setIsSaved(currentComment === defaultCurrentComment && currentRating === defaultCurrentRating);
  }, [currentComment, currentRating, defaultCurrentComment, defaultCurrentRating]);

  return instance.candidates.length === 0 ? (
    <div></div>
  ) : (
    <div className={styles.candidateDeciderContainer}>
      <Modal open={isOpen} onClose={() => setIsOpen(false)} size="small">
        <Modal.Header>Don't Forget To Save!</Modal.Header>
        <Modal.Content>
          <p>You have unsaved changes. Do you want to save them before navigating?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsOpen(false)}>Clancel</Button>
          <Button
            onClick={() => {
              handleRatingAndCommentChange(
                currentCandidate,
                currentRating ?? 0,
                currentComment ?? ''
              );
              confirmNavigation(navigationDirection!);
            }}
          >
            Save and {navigationDirection === 'next' ? 'Proceed' : 'Go Back'}
          </Button>
          <Button primary onClick={() => confirmNavigation(navigationDirection!)}>
            Discard and {navigationDirection === 'next' ? 'Proceed' : 'Go Back'}
          </Button>
        </Modal.Actions>
      </Modal>
      <div className={styles.applicationContainer}>
        <div className={styles.searchBar}>
          <SearchBar
            instance={instance}
            setCurrentCandidate={(candidate) => {
              setCurrentCandidate(candidate);
              populateReviewForCandidate(candidate);
            }}
            currentCandidate={currentCandidate}
          />
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
            onChange={(_, data) => {
              setCurrentCandidate(data.value as number);
              populateReviewForCandidate(data.value as number);
            }}
          />
          <span className={styles.ofNum}>of {instance.candidates.length}</span>
          <Button.Group className={styles.previousNextButtonContainer}>
            <Button
              basic
              color="blue"
              disabled={currentCandidate === 0}
              onClick={() => previous(isSaved)}
            >
              PREVIOUS
            </Button>
            <Button
              basic
              color="blue"
              disabled={currentCandidate === instance.candidates.length - 1}
              onClick={() => next(isSaved)}
            >
              NEXT
            </Button>
          </Button.Group>
          <Button
            className="ui blue button"
            disabled={isSaved}
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
          {hasAdminPermission && (
            <Checkbox
              className={styles.showOtherVotes}
              toggle
              checked={showOtherVotes}
              onChange={() => setShowOtherVotes((prev) => !prev)}
              label="Show other people's votes"
            />
          )}
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
          reviews={completedReviews}
        />
        <GlobalProgressPanel
          showOtherVotes={showOtherVotes}
          candidates={instance.candidates}
          reviews={completedReviews}
        />
      </div>
    </div>
  );
};

export default CandidateDecider;
