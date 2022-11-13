import { Card } from 'react-bootstrap';
import Layout from '../../components/Layout';
import styles from './index.module.css';
import products from '../../data/products.json';

type ProductCard = {
  imageURL: string;
  siteURL: string;
  year: string;
  name: string;
  description: string;
};

const productCards: ProductCard[] = products as ProductCard[];

const IndexPage = (): JSX.Element => (
  <Layout>
    <div style={{ backgroundColor: 'gray', height: '50vh', textAlign: 'center' }}>
      <div>Cornell DTI Website Redesign</div>
    </div>

    <div className={styles.ourProductsTitle}>Our Products</div>
    <div className={styles.ourProductsDescription}>
      We've learned that tackling the hardest problems is the only way to truly create value for the
      people around us. Each of our projects address an unfulfilled need that exists in our
      community using human-centered design and software engineering.
    </div>

    <>
      {productCards.map((productCard, i) => (
        <Card key={i} className={styles.productCard}>
          {i > 0 ? <div className={styles.topPipe}></div> : <></>}
          {i < productCards.length - 1 ? <div className={styles.bottomPipe}></div> : <></>}

          <a href={productCard.siteURL} className={styles.imageAndText}>
            <Card.Img
              className={styles.productImage}
              src={productCard.imageURL}
              alt="Product Image here"
            />
            <Card.Body className={styles.productText}>
              <Card.Subtitle className={styles.year}>{productCard.year}</Card.Subtitle>
              <Card.Title className={styles.productName}>{productCard.name}</Card.Title>
              <Card.Text className={styles.productDescription}>{productCard.description}</Card.Text>
            </Card.Body>
          </a>
        </Card>
      ))}
    </>
  </Layout>
);

export default IndexPage;
