import { useState, useEffect } from 'react';
import { Container, Loader, Form, Button, Header, Label, Divider } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './AdminDevPortfolio.module.css';

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
    <Container className={styles.container}>
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
  const [nameError, setNameError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [earliestDate, setEarliestDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    if (name === '') {
      setNameError(true);
    } else setNameError(false);
    if (deadline < earliestDate) {
      setDateError(true);
    } else setNameError(false);
  };

  return (
    <Form>
      <Header as="h3">Name</Header>
      <Form.Input error={nameError} value={name} onChange={(e) => setName(e.target.value)} />
      <Header as="h3">Earliest Date</Header>
      <DatePicker
        selected={earliestDate}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => setEarliestDate(date)}
      />
      <Header as="h3">Deadline</Header>
      <DatePicker
        selected={deadline}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => setDeadline(date)}
      />
      {dateError ? (
        <Label pointing>The dates for the deadline and earliest date are invalid.</Label>
      ) : undefined}
      <Divider />
      <Button id={styles.submitButton} onClick={() => handleSubmit()}>
        Create Assignment
      </Button>
    </Form>
  );
};

export default AdminDevPortfolio;
