import { useState, useEffect } from 'react';
import { Container, Loader, Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
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
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [earliestDate, setEarliestDate] = useState<Date>(new Date());

  return (
    <Form>
      <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <DatePicker
        selected={deadline}
        dateFormat="MMM d, yyyys"
        onChange={(date: Date) => setDeadline(date)}
      />
      <DatePicker
        selected={earliestDate}
        dateFormat="MMM d, yyyy"
        onChange={(date: Date) => setEarliestDate(date)}
      />
    </Form>
  );
};

export default AdminDevPortfolio;
