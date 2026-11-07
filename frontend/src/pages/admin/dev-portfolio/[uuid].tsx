import { useRouter } from 'next/router';
import DevPortfolioDetails from '../../../components/Admin/DevPortfolio/DevPortfolioDetails';
import NewDevPortfolioDetails from '../../../redesign/Forms/DevPortfolio/DevPortfolioDetails';
import { previewPage } from '../../../redesign/preview';

const PortfolioDetails = previewPage(DevPortfolioDetails, NewDevPortfolioDetails);

const DevPortfolioDetailsPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <PortfolioDetails uuid={uuid as string} isAdminView={true} />;
};

export default DevPortfolioDetailsPage;
