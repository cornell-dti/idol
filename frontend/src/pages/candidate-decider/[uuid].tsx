import { useRouter } from 'next/router';
import CandidateDecider from '../../components/Candidate-Decider/CandidateDecider';

const CandidateDeciderPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <CandidateDecider uuid={uuid as string} />;
};

export default CandidateDeciderPage;
