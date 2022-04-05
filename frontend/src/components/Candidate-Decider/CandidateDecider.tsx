import { useState, useEffect } from 'react';
import { Button, Checkbox, Dropdown } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import ResponsesPanel from './ResponsesPanel';
import LocalProgressPanel from './LocalProgressPanel';
import GlobalProgressPanel from './GlobalProgressPanel';
import { useSelf } from '../Common/FirestoreDataProvider';
import styles from './CandidateDecider.module.css';
import SearchBar from './SearchBar';

type CandidateDeciderProps = {
  uuid: string;
};

const blankInstance: CandidateDeciderInstance = {
  name: '',
  headers: [],
  candidates: [],
  uuid: '',
  authorizedMembers: [],
  authorizedRoles: [],
  isOpen: true
};

const CandidateDecider: React.FC<CandidateDeciderProps> = ({ uuid }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCandidate, setCurrentCandidate] = useState<number>(0);
  const [instance, setInstance] = useState<CandidateDeciderInstance>(blankInstance);
  const [showOtherVotes, setShowOtherVotes] = useState<boolean>(false);

  const userInfo = useSelf();

  const getRating = () => {
    const rating = instance.candidates[currentCandidate].ratings.find(
      (rt) => rt.reviewer.email === userInfo?.email
    );
    if (rating) return rating.rating;
    return 0;
  };

  const getComment = () => {
    const comment = instance.candidates[currentCandidate].comments.find(
      (cmt) => cmt.reviewer.email === userInfo?.email
    );
    if (comment) return comment.comment;
    return '';
  };

  const next = () => {
    if (currentCandidate === instance.candidates.length - 1) return;
    setCurrentCandidate((prev) => prev + 1);
  };

  const previous = () => {
    if (currentCandidate === 0) return;
    setCurrentCandidate((prev) => prev - 1);
  };

  const handleRatingChange = (id: number, rating: Rating) => {
    CandidateDeciderAPI.updateRating(instance.uuid, id, rating).then(() => {
      const updatedInstance: CandidateDeciderInstance = {
        ...instance,
        candidates: instance.candidates.map((cd) =>
          cd.id !== id
            ? cd
            : {
                ...cd,
                ratings: [
                  ...cd.ratings.filter((rt) => rt.reviewer.email !== userInfo?.email),
                  { reviewer: userInfo as IdolMember, rating }
                ]
              }
        )
      };
      setInstance(updatedInstance);
    });
  };

  const handleCommentChange = (id: number, comment: string) => {
    CandidateDeciderAPI.updateComment(instance.uuid, id, comment).then(() => {
      const updatedInstance: CandidateDeciderInstance = {
        ...instance,
        candidates: instance.candidates.map((cd) =>
          cd.id !== id
            ? cd
            : {
                ...cd,
                comments: [
                  ...cd.comments.filter((cmt) => cmt.reviewer.email !== userInfo?.email),
                  { reviewer: userInfo as IdolMember, comment }
                ]
              }
        )
      };
      setInstance(updatedInstance);
    });
  };

  useEffect(() => {
    CandidateDeciderAPI.getInstance(uuid)
      .then((instance) => {
        setInstance(instance);
      })
      .then(() => setIsLoading(false));
  }, [uuid]);

  return isLoading ? (
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
          <Button.Group>
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
          handleRatingChange={handleRatingChange}
          rating={getRating()}
          currentCandidate={currentCandidate}
          handleCommentChange={handleCommentChange}
          comment={getComment()}
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
