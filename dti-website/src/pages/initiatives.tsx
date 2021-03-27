import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from '../components/Layout';
import NovaHero from '../components/NovaHero';
import PageBackground from '../components/PageBackground';
import PageSection from '../components/PageSection';

import FacebookIcon from '../assets/social/facebook-white.svg';
import MediumIcon from '../assets/social/medium-white-m.svg';

export default function InitiativesPage(): JSX.Element {
  return (
    <Layout title="Initiatives">
      <PageBackground>
        <NovaHero
          header="Inspiring Change"
          subheader="What sets us apart from other project teams is our desire to share what we learn with other students and members of the greater Ithaca community."
          video={{
            mp4:
              'https://d2ytxic79evey7.cloudfront.net/pages/initiatives/hero/hero.mp4',
            webm:
              'https://d2ytxic79evey7.cloudfront.net/pages/initiatives/hero/hero.webm'
          }}
          lazy="/static/pages/initiatives-hero-lazy.jpg"
          image="/static/pages/initiatives-hero.png"
        />
        <PageSection className="initiatives-main-section">
          <Container>
            <Row className="initiative-row align-items-center justify-content-center">
              <Col
                sm="12"
                md="7"
                className="initiative-row-img order-md-2 order-sm-1"
              >
                <img
                  className="initiative-row-image"
                  src="/static/pages/initiatives-promo-makeathon.png"
                  alt="makeathon"
                />
              </Col>
              <Col
                className="initiative-row-content-container order-md-1 order-sm-2"
                sm="12"
                md="5"
              >
                <div className="initiative-row-content-header">
                  Ready, Set, Make!
                </div>
                <div className="initiative-row-content-subheader">
                  Inspiring future generations.
                </div>
                <p className="initiative-row-content">
                  Ready, Set, Make is an annual make-a-thon our team hosts for
                  5th and 6th grade students! We invite students in the local
                  community to Cornell and how they can use design thinking to
                  solve problems that they encounter. Their energy and
                  creativity was contagious, and team members and kids alike
                  were building incredible prototypes out of cardboard and craft
                  supplies! DTI partnered with Makerspace to give an
                  introduction to 3D printing using Tinkercad.
                </p>
                <Button
                  variant="secondary"
                  className="social-button"
                  href="https://medium.com/@alice.pham/5b9033aa7a6e"
                >
                  <MediumIcon />
                  <div className="social-button-text">Read More</div>
                </Button>
              </Col>
            </Row>
            <Row className="initiative-row justify-content-center align-items-center">
              <Col
                sm="12"
                md="7"
                className="initiative-row-img order-md-1 order-sm-1"
              >
                <img
                  className="initiative-row-image"
                  src="/static/pages/initiatives-promo-blueprint.png"
                  alt="blueprint"
                />
              </Col>
              <Col
                sm="12"
                md="5"
                className="initiative-row-content-container order-md-2 order-sm-2"
              >
                <div className="initiative-row-content-header">
                  DTI Blueprint
                </div>
                <div className="initiative-row-content-subheader">
                  Fostering Mentorship.
                </div>
                <p className="initiative-row-content">
                  DTI Blueprint is a training program designed to teach students
                  about design and product thinking from team members’ own
                  experience. Over several weeks, DTI team members gave
                  workshops on concepts like user research, product ideation,
                  and minimum viable products. Students formed groups and
                  brainstormed a problem to solve on campus and came up with a
                  testable solution.
                </p>
              </Col>
            </Row>
            <Row className="initiative-row align-items-center justify-content-center">
              <Col
                sm="12"
                md="7"
                className="initiative-row-img order-md-2 order-sm-1"
              >
                <img
                  className="initiative-row-image"
                  src="/static/pages/initiatives-promo-halfbaked.png"
                  alt="halfbaked"
                />
              </Col>
              <Col
                sm="12"
                md="5"
                className="initiative-row-content-container order-md-1 order-sm-2"
              >
                <div className="initiative-row-content-header">
                  Events &amp; Workshops
                </div>
                <div className="initiative-row-content-subheader">
                  Our presence on campus.
                </div>
                <p className="initiative-row-content">
                  We are constantly trying to find ways to expand beyond our
                  team and help the community through holding workshops and
                  events. In the past, we have held workshops on UX Research,
                  building a website portfolio, and more!
                </p>
                <Button
                  variant="secondary"
                  className="social-button"
                  href="https://www.facebook.com/cornelldti/events/"
                >
                  <FacebookIcon />
                  <div className="social-button-text">See Events</div>
                </Button>
              </Col>
            </Row>
          </Container>
        </PageSection>
      </PageBackground>
    </Layout>
  );
}
