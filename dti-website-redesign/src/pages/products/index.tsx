import Layout from '../../components/Layout';
import { Card } from 'react-bootstrap';
import styles from './index.module.css';

const IndexPage = (): JSX.Element => (
  <Layout>
    <div style={{ backgroundColor: 'gray', height: '50vh', textAlign: 'center' }}>
      <div>Cornell DTI Website Redesign</div>
    </div>

    <div>Our Products</div>
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
    
    <Card className={styles.productCard}>
      <div className={styles.imageAndText}>
        <Card.Img className={styles.productImage} src={"/static/products/cureview.png"} alt="Product Image here"/>
        <Card.Body className={styles.productText}>
          <Card.Subtitle className={styles.year}>Fall 2017</Card.Subtitle>
          <Card.Title className={styles.productName}>CU Reviews</Card.Title>
          <Card.Text className={styles.productDescription}>
          Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.
          </Card.Text>
        </Card.Body>
      </div>
    </Card>

  </Layout>
);

export default IndexPage;
