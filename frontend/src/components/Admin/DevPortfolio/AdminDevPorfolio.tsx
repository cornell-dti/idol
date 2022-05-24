import React, { useState, useEffect } from 'react';
import {
  Container,
  Loader,
  Form,
  Button,
  Header,
  Label,
  Divider,
  Message,
  Card
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './AdminDevPortfolio.module.css';
import DevPortfolioDeleteModal from '../../Modals/DevPortfolioDeleteModal';

const AdminDevPortfolio: React.FC = () => {
  const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllDevPortfolios = () => {
    setIsLoading(true);
    DevPortfolioAPI.getAllDevPortfolios().then((devPortfolios) => {
      setIsLoading(false);
      setDevPortfolios(devPortfolios);
    });
  };

  useEffect(() => {
    getAllDevPortfolios();
  }, []);

  return (
    <Container className={styles.container}>
      <Container>
        <AdminDevPortfolioForm setDevPortfolios={setDevPortfolios} />
      </Container>
      <Divider />
      <AdminDevPortfolioDashboard
        isLoading={isLoading}
        devPortfolios={devPortfolios}
        setDevPortfolios={setDevPortfolios}
        setIsLoading={setIsLoading}
      />
    </Container>
  );
};

type AdminDevPortfolioDashboardProps = {
  readonly devPortfolios: DevPortfolio[];
  readonly isLoading: boolean;
  readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setDevPortfolios: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
};

const AdminDevPortfolioDashboard: React.FC<AdminDevPortfolioDashboardProps> = ({
  devPortfolios,
  setDevPortfolios,
  isLoading,
  setIsLoading
}) => (
  <Container>
    {isLoading ? (
      <Loader active />
    ) : (
      <>
        <Card.Group>
          {devPortfolios.map((portfolio) => (
            <Card href={`/admin/dev-portfolio/${portfolio.uuid}`}>
              <Card.Content>
                <DevPortfolioDeleteModal
                  uuid={portfolio.uuid}
                  name={portfolio.name}
                  setDevPortfolios={setDevPortfolios}
                />
                <Card.Header>{portfolio.name}</Card.Header>
                <Card.Meta>{portfolio.submissions.length} submissions</Card.Meta>
                <Card.Description>
                  Due: {new Date(portfolio.deadline).toDateString()}
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </>
    )}
  </Container>
);

type AdminDevPortfolioFormProps = {
  readonly setDevPortfolios: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
};

const AdminDevPortfolioForm: React.FC<AdminDevPortfolioFormProps> = ({ setDevPortfolios }) => {
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [earliestDate, setEarliestDate] = useState<Date>(new Date());
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = () => {
    if (name === '') {
      setNameError(true);
      return;
    }
    setNameError(false);
    if (deadline < earliestDate || deadline < new Date()) {
      setDateError(true);
      return;
    }
    setNameError(false);
    const portfolio = {
      name,
      deadline: deadline.getTime(),
      earliestValidDate: earliestDate.getTime(),
      submissions: [],
      uuid: ''
    };
    DevPortfolioAPI.createDevPortfolio(portfolio).then((portfolio) => {
      setDevPortfolios((portfolios) => [...portfolios, portfolio]);
      setSuccess(true);
    });
  };

  return (
    <Form success={success}>
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
      <Message
        success
        header="Dev Portfolio Created"
        content={`${name} was successfully created and will be due on ${deadline.toDateString()}`}
      />
    </Form>
  );
};

export default AdminDevPortfolio;
