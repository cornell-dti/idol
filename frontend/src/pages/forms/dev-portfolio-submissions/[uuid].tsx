import { useRouter } from 'next/router';
import DevPortfolioDetails from '../../../components/Admin/DevPortfolio/DevPortfolioDetails';
import NewDevPortfolioDetails from '../../../redesign/Forms/DevPortfolio/DevPortfolioDetails';
import { usePreview } from '../../../redesign/preview';

const DevPortfolioDetailsPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return usePreview() ? (
    <NewDevPortfolioDetails uuid={uuid as string} />
  ) : (
    <DevPortfolioDetails uuid={uuid as string} isAdminView={false} />
  );
};

export default DevPortfolioDetailsPage;
