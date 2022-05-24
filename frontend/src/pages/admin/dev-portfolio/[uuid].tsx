import { useRouter } from 'next/router';
import DevPortfolioDetails from '../../../components/Admin/DevPortfolio/DevPortfolioDetails';

const DevPortfolioDetailsPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <DevPortfolioDetails uuid={uuid as string} />;
};

export default DevPortfolioDetailsPage;
