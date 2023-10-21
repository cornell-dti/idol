import React, { useState, useEffect } from 'react';
import { Container, Loader, Divider, Card } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './AdminDevPortfolio.module.css';
import DevPortfolioDeleteModal from '../../Modals/DevPortfolioDeleteModal';
import AdminDevPortfolioForm from './AdminDevPortfolioForm';
import EditDevPortfolio from './EditDevPortfolio';
import { Emitters } from '../../../utils';

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

  const fullReset = () => {
    setIsLoading(true);
    setDevPortfolios([]);
  };

  useEffect(() => {
    const cb = () => {
      fullReset();
    };
    Emitters.devPortfolioUpdated.subscribe(cb);
    return () => {
      Emitters.devPortfolioUpdated.unsubscribe(cb);
    };
  });

  useEffect(() => {
    if (isLoading) {
      DevPortfolioAPI.getAllDevPortfolios().then((devPortfolios) => {
        setDevPortfolios(devPortfolios);
        setIsLoading(false);
      });
    }
  }, [isLoading]);

  return (
    <Container className={styles.container}>
      <Container>
        <h1>Create a Dev Portfolio</h1>
        <AdminDevPortfolioForm setDevPortfolios={setDevPortfolios} formType="create" />
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
                  <>
                    <EditDevPortfolio
                      devPortfolio={portfolio}
                      setDevPortfolios={setDevPortfolios}
                    />
                    <DevPortfolioDeleteModal
                      uuid={portfolio.uuid}
                      name={portfolio.name}
                      setDevPortfolios={setDevPortfolios}
                    />
                  </>
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

export default AdminDevPortfolio;
