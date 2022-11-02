import Layout from '../../components/Layout';
import { Card } from 'react-bootstrap';
import styles from './index.module.css';

const IndexPage = (): JSX.Element => (
  <Layout>
    {/* <div style={{ backgroundColor: 'gray', height: '50vh', textAlign: 'center' }}>
      <div>Placeholder</div>
    </div> */}

    <div>



    <div style={{ backgroundColor: 'gray', height: '50vh', textAlign: 'center' }}>
      <div>Cornell DTI Website Redesign</div>
    </div>
    
    <Card className={styles.productCard}>
      <div className={styles.imageAndText}>
        <Card.Img className={styles.productImage} src={"/static/products/cureview.png"} alt="Product Image here"/>
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">Fall 2017</Card.Subtitle>
          <Card.Title>CU Reviews</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
      </div>
    </Card>



    </div>

  </Layout>
);

export default IndexPage;
