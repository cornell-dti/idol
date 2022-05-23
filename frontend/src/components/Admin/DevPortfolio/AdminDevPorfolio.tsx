import { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';

const AdminDevPortfolio: React.FC = () => {
  const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    DevPortfolioAPI.getAllDevPortfolios().then((devPortfolios) => {
      setDevPortfolios(devPortfolios);
      setIsLoading(false);
    });
  }, [setDevPortfolios]);

  return <Container>Hello World</Container>;
};

export default AdminDevPortfolio;
