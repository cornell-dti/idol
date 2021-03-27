import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CircleProgressIndicator from '../components/CircleProgressIndicator';
import HeadshotGrid from '../components/HeadshotGrid';

import Layout from '../components/Layout';
import NovaHero from '../components/NovaHero';
import PageBackground from '../components/PageBackground';
import PageSection from '../components/PageSection';
import RoleSelector, { RoleId } from '../components/RoleSelector';

import members from '../data/all-members.json';
import { diversity } from '../data/sets/diversity.json';

export default function TeamPage(): JSX.Element {
  const [roleId, setRoleId] = useState<RoleId>('');

  const malePercentage = 1 - diversity.femalePercentage[roleId];
  const femalePercentage = diversity.femalePercentage[roleId];

  const filterMembers = (
    role = '',
    isLead = false
  ): readonly { info: NovaMember; id: string }[] =>
    members
      .filter(
        (member) =>
          ((typeof member.roleId === 'string' &&
            member.roleId.endsWith(role)) ||
            role === '') &&
          // @ts-expect-error: missing
          (member.isLead != null && member.isLead === true) === isLead
      )
      .map((member) => ({ info: member, id: member.netid }))
      .sort((a, b) => {
        const aname = a.info.name;
        const bname = b.info.name;

        if (aname < bname) return -1;
        if (aname > bname) return 1;

        return 0;
      });

  return (
    <Layout title="Team" className="team-page">
      <PageBackground>
        <NovaHero
          header="Working Together"
          subheader="We are Cornell Design & Tech Initiative. But individually, we are a talented, diverse group of students from different colleges and countries striving to make a difference in our community."
          video={{
            mp4:
              'https://d2ytxic79evey7.cloudfront.net/pages/team/hero/hero.mp4',
            webm:
              'https://d2ytxic79evey7.cloudfront.net/pages/team/hero/hero.webm'
          }}
          lazy="/static/pages/team-hero-lazy.jpg"
          image="/static/pages/team-hero.png"
        />
        <div className="diversity diversity-background">
          <Row className="no-gutters diversity diversity-content">
            <Col
              sm="12"
              md="7"
              className="diversity-inner-left diversity-left-overlay"
            >
              <Row>
                <Col sm="12" md="9">
                  <div className="team-header diversity-header my-auto">
                    Diversity
                  </div>
                  <div className="diversity-description my-auto lg-y-padding">
                    More than just being inclusive, our team strives to bring as
                    many backgrounds and perspectives together to solve
                    community problems. These statistics come from recruiting
                    across campus and seeking applicants with the best skills
                    and potential for growth on the team. Updated Spring 2019.
                  </div>
                  <h3 className="graph-header lg-y-padding">Gender Ratio</h3>
                  <Row className="lg-y-padding justify-content-center">
                    <Col className="col-auto">
                      <CircleProgressIndicator percentage={femalePercentage}>
                        <div className="text-center graph-data h-100">
                          <Row className="h-100 align-items-center">
                            <Col className="col-6 graph-datum">
                              <h3>{`${Math.round(100 * malePercentage)}%`}</h3>
                              <p className="graph-datum-description">Male</p>
                            </Col>
                            <Col className="col-6 graph-datum red">
                              <h3>{`${Math.round(
                                100 * femalePercentage
                              )}%`}</h3>
                              <p className="graph-datum-description">Female</p>
                            </Col>
                          </Row>
                        </div>
                      </CircleProgressIndicator>
                    </Col>
                  </Row>
                  <Row className="my-auto justify-content-center">
                    <Col>
                      <RoleSelector
                        roleId={roleId}
                        onRoleIdChange={setRoleId}
                        className="diversity-role-selector"
                        centered={true}
                        dark={true}
                        density="compact"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md="3" />
              </Row>
            </Col>
            <Col
              sm="12"
              md="4"
              className="diversity-inner-right mx-auto align-self-center"
            >
              <Row>
                <Col className="col-12 diversity-description diversity-inner-text">
                  <div className="diversity-stat-header">58%</div>
                  <div className="diversity-description diversity-stat-description">
                    Percentage of underclassmen team members
                  </div>
                </Col>
                <Col className="col-12 diversity-description diversity-inner-text">
                  <div className="diversity-stat-header">13</div>
                  <div className="diversity-description diversity-stat-description">
                    Number of different majors
                  </div>
                </Col>
                <Col className="col-12 diversity-description diversity-inner-text">
                  <div className="diversity-stat-header">6</div>
                  <div className="diversity-description diversity-stat-description">
                    Number of represented colleges
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <Container fluid>
          <PageSection>
            <div className="team-header diversity-header">Team</div>
            <br />

            <Row className="justify-content-center">
              <Col className="col-12">
                <RoleSelector
                  density="normal"
                  className="team-role-selector"
                  roleId={roleId}
                  onRoleIdChange={setRoleId}
                />
                <HeadshotGrid
                  members={[
                    ...filterMembers(roleId, true),
                    ...filterMembers(roleId)
                  ]}
                />
              </Col>
            </Row>
          </PageSection>
        </Container>
      </PageBackground>
    </Layout>
  );
}
