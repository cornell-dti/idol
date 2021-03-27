import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import WhiteCheck from '../assets/sponsor/whitecheck.svg';
import Layout from '../components/Layout';
import NovaHero from '../components/NovaHero';
import PageBackground from '../components/PageBackground';
import PageSection from '../components/PageSection';

const sponsors = [
  {
    benefits: 'Recognition on DTI Website',
    subheader: 'Logo placement on sponsorship materials',
    tiers: { bronze: true, silver: true, gold: true, platinum: true }
  },
  {
    benefits: 'Campus-Wide Marketing & Publicity',
    subheader: 'Support and usage of company products on campus',
    tiers: { bronze: true, silver: true, gold: true, platinum: true }
  },
  {
    benefits: 'Resume Book Access',
    subheader: 'Access to our talent pipeline for recruitment',
    tiers: { bronze: false, silver: true, gold: true, platinum: true }
  },
  {
    benefits: 'Flagship Initiative Co-Sponsor',
    subheader: 'Company specific publicity and swag distribution',
    tiers: { bronze: false, silver: true, gold: true, platinum: true }
  },
  {
    benefits: 'Host One Standard Initiative',
    subheader: 'One per semester; Includes technical workshops, career chats',
    tiers: { bronze: false, silver: false, gold: true, platinum: true }
  },
  {
    benefits: 'Host Multiple Initiatives',
    subheader:
      'Up to three events per semester with priority scheduling Every additional event costs $250',
    tiers: { bronze: false, silver: false, gold: true, platinum: true }
  },
  {
    benefits: 'Tabling Slot in Engineering Hall',
    subheader:
      'Reserve space in Duffield Hall, a central engineering hub  Ideal for networking, swag distributions, and branding',
    tiers: { bronze: false, silver: false, gold: false, platinum: true }
  }
];

export default function SponsorPage(): JSX.Element {
  return (
    <Layout title="Sponsor" hideSubfooter>
      <PageBackground>
        <NovaHero
          header="Sponsor Our Mission"
          subheader="We want to partner with organizations who have a similar vision of changing the world. Together, we can work towards improving our communities with technology."
          lazy="/static/pages/sponsor-hero-lazy.jpg"
        />
        <Container>
          <PageSection>
            <Row className="sponsor-row align-items-center justify-content-center">
              <Col
                sm="12"
                md="7"
                className="sponsor-row-img order-md-2 order-sm-1"
              >
                <img
                  className="sponsor-row-image"
                  src="/static/pages/sponsor-events-googleLunch.jpg"
                  alt="google lunch"
                />
              </Col>
              <Col
                className="sponsor-row-content-container order-md-1 order-2"
                sm="12"
                md="5"
              >
                <h2 className="sponsor-row-content-header">
                  Build Relationships
                </h2>
                <p className="sponsor-row-content">
                  We want sponsors to be as invested in partnering with us as we
                  are with them. In addition to helping make community
                  initiatives possible, we will help organizations create
                  diverse talent pipeline, present information sessions, conduct
                  workshops, and help establish a presence on our campus.
                </p>
              </Col>
            </Row>
            <Row className="sponsor-row align-items-center justify-content-center">
              <Col
                sm="12"
                md="5"
                className="sponsor-row-content-container order-2"
              >
                <h2>Impact</h2>
                <p className="sponsor-row-content">
                  All of the funds we receive through sponsorships is directly
                  invested back into the team. Through user research, software
                  licenses, community outreach, and marketing, sponsorships help
                  us grow our vision of helping out the community through
                  technology.
                </p>
              </Col>
              <Col
                sm="12"
                md="7"
                className="sponsor-row-img order-md-1 order-1"
              >
                <img
                  className="sponsor-row-image"
                  src="/static/pages/sponsor-events-infoSesion.png"
                  alt="info session"
                />
              </Col>
            </Row>
          </PageSection>
        </Container>
        <Container fluid className="sponsor-tier-background">
          <PageSection>
            <Row>
              <Col>
                <h2 className="sponsor-tier-heading">Sponsorship Tiers</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="sponsor-tiers">
                  <div className="sponsor-table">
                    <Table striped={false} bordered={false}>
                      <thead>
                        <tr>
                          <th aria-colindex={1}>
                            <div className="table-header">Benefits</div>
                          </th>
                          <th aria-colindex={2}>
                            <div className="bronze-header">Bronze</div>
                          </th>
                          <th aria-colindex={3}>
                            <div className="silver-header">Silver</div>
                          </th>
                          <th aria-colindex={4}>
                            <div className="gold-header">Gold</div>
                          </th>
                          <th aria-colindex={5}>
                            <div className="platinum-header">Platinum</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sponsors.map((item) => (
                          <tr key={item.benefits}>
                            <td>
                              <Row>
                                <Col className="col-12 text-sm-head">
                                  {item.benefits}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="col-12 text-sm-left">
                                  {item.subheader}
                                </Col>
                              </Row>
                            </td>
                            <td>
                              <Row className="bronze">
                                <Col>
                                  {item.tiers.bronze && (
                                    <WhiteCheck className="checkmark bronze-checkmark" />
                                  )}
                                </Col>
                              </Row>
                            </td>
                            <td>
                              <Row className="silver">
                                <Col>
                                  {item.tiers.silver && (
                                    <WhiteCheck className="checkmark silver-checkmark" />
                                  )}
                                </Col>
                              </Row>
                            </td>
                            <td>
                              <Row className="gold">
                                <Col lg="3">
                                  {item.tiers.gold && (
                                    <WhiteCheck className="checkmark gold-checkmark" />
                                  )}
                                </Col>
                              </Row>
                            </td>
                            <td>
                              <Row className="platinum">
                                <Col lg="3">
                                  {item.tiers.platinum && (
                                    <WhiteCheck className="checkmark platinum-checkmark" />
                                  )}
                                </Col>
                              </Row>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Col>
            </Row>
          </PageSection>
        </Container>
        <Container>
          <PageSection>
            <Row className="text-center justify-content-center sponsor-contact">
              <h2>Sponsor us to help make community impact!</h2>
            </Row>
            <Row className="justify-content-center sponsor-contact">
              <Button variant="secondary" href="mailto:hello@cornelldti.org">
                Contact Us
              </Button>
            </Row>
          </PageSection>
          <PageSection>
            <h2 className="sponsor-list-heading">Current Sponsors</h2>
            <Row className="sponsor-list justify-content-center">
              <Col className="my-auto" sm="12" md="6">
                <img
                  className="sponsor-icon"
                  src="/static/pages/sponsor-capitalone.png"
                  alt="capitalone"
                />
              </Col>
              <Col className="my-auto" sm="12" md="6">
                <img
                  className="sponsor-icon"
                  src="/static/pages/sponsor-cornellengineeringalumni.png"
                  alt="cornell engineering alumni"
                />
              </Col>
            </Row>
            <Row className="sponsor-list-small justify-content-center">
              <Col className="my-auto" sm="12" md="3">
                <img
                  className="sponsor-icon"
                  src="/static/pages/sponsor-invision.png"
                  alt="invision"
                />
              </Col>
              <Col className="my-auto" sm="12" md="3">
                <img
                  className="sponsor-icon"
                  src="/static/pages/sponsor-zeplin.png"
                  alt="zeplin"
                />
              </Col>
              <Col className="my-auto" sm="12" md="3">
                <img
                  className="sponsor-icon"
                  src="/static/pages/sponsor-google.png"
                  alt="google"
                />
              </Col>
              <Col className="my-auto" sm="12" md="3">
                <img
                  className="sponsor-icon"
                  src="/static/pages/sponsor-asana.png"
                  alt="asana"
                />
              </Col>
            </Row>
          </PageSection>
        </Container>
      </PageBackground>
    </Layout>
  );
}
