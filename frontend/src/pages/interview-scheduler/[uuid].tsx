import { useRouter } from 'next/router';
import InterviewScheduler from '../../components/Interview-Scheduler/InterviewScheduler';

const InterviewSchedulerPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <InterviewScheduler uuid={uuid as string} />;
};

export default InterviewSchedulerPage;
