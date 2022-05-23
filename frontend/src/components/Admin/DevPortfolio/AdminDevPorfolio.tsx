import { useState, useEffect } from 'react';
import { Container, Loader, Form } from 'semantic-ui-react';
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

  return (
    <Container>
      <Container>
        <AdminDevPortfolioForm />
      </Container>
      <Container>
        {isLoading ? <Loader active large /> : <>{JSON.stringify(devPortfolios)}</>}
      </Container>
    </Container>
  );
};

const AdminDevPortfolioForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  return (
    <Form>
      <Form.Input label="Name" value={name} />
      <Form.Input />
    </Form>
  );
};

export default AdminDevPortfolio;
