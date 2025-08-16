import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from '../components/Layout';
import NovaHero from '../components/NovaHero';
import PageBackground from '../components/PageBackground';
import PageSection from '../components/PageSection';

import ApplyIcon from '../assets/other/apply.svg';

const courses = [
  {
    id: 'trends',
    header: 'Trends in Web Development',
    subtitle: 'Modern Industry-Leading Technologies',
    description:
      'Trends in Web Development is a 2-credit S/U course that showcases modern full-stack development and best practices used within industry. We cover technologies like TypeScript, React, Node.js, Firebase, Express and more, all of which are deployed at scale by leading tech companies. ',
    image: '/static/pages/courses-promo-trends.jpg',
    buttons: {
      apply: {
        title: 'Apply',
        link: 'https://bit.ly/web-dev-fa22'
      }
    },
    subDescription1: {
      title: 'Best Practices',
      description:
        'We emphasize best engineering practices for every element of the course taught, from API design to frontend modularization.'
    },
    subDescription2: {
      title: 'Deploy',
      description:
        'Learn how to deploy your web applications to the cloud using service providers such as Heroku or the Google Cloud Platform.'
    },
    subDescription3: {
      title: 'Final Project',
      description:
        'The class ends with a final capstone project consolidating all the topics discussed in class, which can be used on your resume or portfolio.'
    },
    courseWebsiteLink: 'https://webdev.cornelldti.org/'
  }
];

export default function CoursesPage(): JSX.Element {
  return (
    <Layout title="Courses">
      <PageBackground>
        <NovaHero
          header="Teaching The Community"
          subheader="A project team is meant, above all, to be a learning experience. Given our mission of community impact, we want to help everyone learn and grow through our training courses in design, technology, and product development."
          lazy="/static/pages/courses-hero-lazy.jpg"
          image="/static/pages/courses-hero.png"
        />
        <Container>
          {courses.map((c, i) => {
            const order = 2 - (i % 2);

            return (
              <PageSection key={c.id}>
                <Row className="courses-row align-items-center justify-content-center">
                  <Col lg="7" className={`col-12 order-lg-${order} order-1 courses-row-img`}>
                    <img className="courses-row-image" src={c.image} alt="" />
                  </Col>
                  <Col
                    className={`courses-row-content-container col-12 order-lg-${
                      (order % 2) + 1
                    } order-2`}
                    lg="5"
                  >
                    <h2 className="courses-row-content-header">{c.header}</h2>
                    <div className="courses-row-content-subheader">{c.subtitle}</div>
                    <Button
                      variant="secondary"
                      className="social-button"
                      href={c.buttons.apply.link}
                    >
                      <ApplyIcon />
                      <div className="social-button-text">{c.buttons.apply.title || ''}</div>
                    </Button>
                  </Col>
                </Row>
                <Row className="courses-row align-items-center justify-content-center">
                  <p className="courses-row-content">{c.description}</p>
                </Row>
                <Row className="justify-content-center">
                  <Col sm="12" md="4">
                    <h3>{c.subDescription1.title}</h3>
                    <p>{c.subDescription1.description}</p>
                  </Col>
                  <Col sm="12" md="4">
                    <h3>{c.subDescription2.title}</h3>
                    <p>{c.subDescription2.description}</p>
                  </Col>
                  <Col sm="12" md="4">
                    <h3>{c.subDescription3.title}</h3>
                    <p>{c.subDescription3.description}</p>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Button
                    variant="secondary"
                    href={c.courseWebsiteLink}
                    className="social-button-red social-button-small social-button-inline"
                  >
                    <div className="course-website-text">Course Textbook</div>
                  </Button>
                </Row>
              </PageSection>
            );
          })}
        </Container>
      </PageBackground>
    </Layout>
  );
}
