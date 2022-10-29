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

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

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
      <DevPortfolioDashboard
        isLoading={isLoading}
        devPortfolios={devPortfolios}
        setDevPortfolios={setDevPortfolios}
        setIsLoading={setIsLoading}
        isAdminView={true}
      />
    </Container>
  );
};

type DevPortfolioDashboardProps = {
  readonly devPortfolios: DevPortfolio[];
  readonly isLoading: boolean;
  readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setDevPortfolios: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
  readonly isAdminView: boolean;
};

export const DevPortfolioDashboard: React.FC<DevPortfolioDashboardProps> = ({
  devPortfolios,
  setDevPortfolios,
  isLoading,
  setIsLoading,
  isAdminView
}) => (
  <Container>
    {isLoading ? (
      <Loader active />
    ) : (
      <>
        <Card.Group>
          {devPortfolios.map((portfolio) => (
            <Card key={portfolio.uuid}>
              <Card.Content>
                {isAdminView ? (
                  <DevPortfolioDeleteModal
                    uuid={portfolio.uuid}
                    name={portfolio.name}
                    setDevPortfolios={setDevPortfolios}
                  />
                ) : (
                  <></>
                )}
                <Card.Header className={styles.cardHeader}>
                  <a
                    href={`${
                      isAdminView ? `/admin/dev-portfolio/` : `/forms/dev-portfolio-submissions/`
                    }${portfolio.uuid}`}
                  >
                    {portfolio.name}
                  </a>
                </Card.Header>
                {isAdminView ? (
                  <Card.Meta>
                    {portfolio.submissions.length} submission
                    {portfolio.submissions.length !== 1 ? 's' : ''}
                  </Card.Meta>
                ) : (
                  <></>
                )}
                <Card.Description>
                  <Container className={styles.cardDescription}>
                    <div>Due: {new Date(portfolio.deadline).toDateString()}</div>
                    <div>
                      {portfolio.lateDeadline
                        ? `Late Deadline: ${new Date(portfolio.lateDeadline).toDateString()}`
                        : ''}
                    </div>
                  </Container>
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
  const [dateErrorMsg, setDateErrorMsg] = useState<string>('');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [earliestDate, setEarliestDate] = useState<Date>(new Date());
  const [lateDeadline, setLateDeadline] = useState<Date | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = () => {
    if (name === '') {
      setNameError(true);
      return;
    }
    setNameError(false);
    if (deadline < earliestDate) {
      setDateError(true);
      setDateErrorMsg('Deadline must be after earliest possible date.');
      return;
    }
    if (deadline < new Date() && !isSameDay(deadline, new Date())) {
      setDateError(true);
      setDateErrorMsg('Deadline cannot be before today.');
      return;
    }
    if (lateDeadline && deadline > lateDeadline && !isSameDay(deadline, lateDeadline)) {
      setDateError(true);
      setDateErrorMsg('Late deadline cannot be before the regular deadline');
      return;
    }
    setNameError(false);
    setDateErrorMsg('');
    const portfolio = {
      name,
      deadline: deadline.getTime(),
      earliestValidDate: earliestDate.getTime(),
      lateDeadline: lateDeadline ? lateDeadline.getTime() : null,
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
      <Header as="h3">Late Deadline (optional)</Header>
      <DatePicker
        selected={lateDeadline}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => setLateDeadline(date)}
      />
      {dateError ? (
        <Label
          pointing
        >{`The dates for the deadline and earliest date are invalid: ${dateErrorMsg}`}</Label>
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
