import { useState, useEffect } from 'react';
import { Container, Header, Table } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './DevPortfolioDetails.module.css';

type Props = {
  uuid: string;
};

const DevPortfolioDetails: React.FC<Props> = ({ uuid }) => {
  const [portfolio, setPortfolio] = useState<DevPortfolio | null>(null);

  useEffect(() => {
    DevPortfolioAPI.getDevPortfolio(uuid).then((portfolio) => setPortfolio(portfolio));
  }, [uuid]);
  return !portfolio ? (
    <></>
  ) : (
    <Container className={styles.container}>
      <Header textAlign="center" as="h1">
        {portfolio.name}
      </Header>

      <Header as="h3" textAlign="center">
        Earliest Valid Date: {new Date(portfolio.earliestValidDate).toDateString()}
      </Header>
      <Header textAlign="center" as="h3">
        Deadline: {new Date(portfolio.deadline).toDateString()}
      </Header>
      <Table>
        <Table.Header>
          <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
        </Table.Header>
      </Table>
    </Container>
  );
};

export default DevPortfolioDetails;
