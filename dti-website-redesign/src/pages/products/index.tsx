import Layout from '../../components/Layout';
import { Card } from 'react-bootstrap';
import styles from './index.module.css';

type ProductCard = {
  imageURL: string;
  siteURL: string;
  year: string;
  name: string;
  description: string;
};

const productCards: ProductCard[] = [
  {
    imageURL: '/static/products/cureview.png',
    siteURL: '/products/cureviews',
    year: 'Fall 2017',
    name: 'CU Reviews',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/queuemein.png',
    siteURL: '/products/queuemein',
    year: 'Fall 2017',
    name: 'Queue Me In',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/courseplan.png',
    siteURL: '/products/courseplan',
    year: 'Fall 2019',
    name: 'CoursePlan',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/carriage.png',
    siteURL: '/products/carriage',
    year: 'Fall 2019',
    name: 'Carriage',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/cuapt.png',
    siteURL: '/products/cuapt',
    year: 'Fall 2020',
    name: 'CU Apartments',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/designatcornell.png',
    siteURL: '/products/designatcornell',
    year: 'Fall 2020',
    name: 'Design @ Cornell',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/zing.png',
    siteURL: '/products/zing',
    year: 'Spring 2021',
    name: 'Zing',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  },
  {
    imageURL: '/static/products/cornellgo.png',
    siteURL: '/products/cornellgo',
    year: 'Fall 2021',
    name: 'Cornell Go',
    description:
      'Helping students find professors and classes that work best for them, CU Reviews began in 2017 as a database of student reviews and testimonies.'
  }
];

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
