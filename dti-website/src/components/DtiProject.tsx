import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from './Layout';
import PageBackground from './PageBackground';
import ProjectHeader from './ProjectHeader';

import allProjects from '../data/all-projects.json';
import allMembers from '../data/all-members.json';
import TextHero from './TextHero';
import ProjectFeaturesList from './ProjectFeaturesList';
import ProjectLearnMore from './ProjectLearnMore';
import TeamMembers from './TeamMembers';

export default function DtiProject({
  teamId
}: {
  readonly teamId: string;
}): JSX.Element {
  const project = allProjects.find((it) => it.teamId === teamId);
  if (project == null) throw new Error();
  const pastMembers = allMembers.filter((member) =>
    ((member.formerSubteams || []) as string[]).includes(teamId)
  );
  const currentMembers = allMembers.filter((member) =>
    member.subteams ? (member.subteams as string[]).includes(teamId) : false
  );

  return (
    <Layout title={project.name} lightHeader>
      <PageBackground>
        <ProjectHeader project={project} />
        <Container fluid>
          <Row className="justify-content-center">
            <Col md="10" sm="12">
              <Container fluid>
                <TextHero
                  header={project.hero.header}
                  subheader={project.hero.subheader}
                />
              </Container>
              <ProjectFeaturesList project={project} />
              <TeamMembers past={pastMembers} current={currentMembers} />
              <ProjectLearnMore project={project} />
            </Col>
          </Row>
        </Container>
      </PageBackground>
    </Layout>
  );
}
