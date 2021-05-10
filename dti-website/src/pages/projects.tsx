import Link from 'next/link';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Layout from '../components/Layout';
import NovaHero from '../components/NovaHero';
import PageBackground from '../components/PageBackground';
import PageSection from '../components/PageSection';

import projects from '../data/all-projects.json';

function getProjectRows(): {
  index: number;
  members: Project[];
}[] {
  const rows = [];
  let row = [];
  let rowIndex = 0;
  for (let i = 0; i < projects.length; i += 1) {
    // eslint-disable-next-line no-continue
    if (projects[i].active === false) continue;
    row.push(projects[i]);
    if (row.length === 3 || rows.length * 3 === projects.length) {
      rows.push({ index: rowIndex, members: row });
      rowIndex += 1;
      row = [];
    }
  }
  if (row.length > 0) {
    rows.push({ index: rowIndex, members: row });
  }
  return rows;
}

export default function ProjectsPage(): JSX.Element {
  const projectRows = getProjectRows();

  return (
    <Layout title="Projects">
      <PageBackground>
        <NovaHero
          header="We Are Our Products"
          subheader="We've learned that tackling the hardest problems is the only way to truly create value for the people around us. Each of our projects address an unfulfilled need that exists in our community using human-centered design and software engineering."
          video={{
            mp4: 'https://d2ytxic79evey7.cloudfront.net/pages/projects/hero/hero.mp4',
            webm: 'https://d2ytxic79evey7.cloudfront.net/pages/projects/hero/hero.webm'
          }}
          lazy="/static/pages/projects-hero-lazy.jpg"
          image="/static/pages/projects-hero.png"
        />
        <PageSection className="project-page-main-section">
          {projectRows.map((projectRow) => (
            <Row className="project-row justify-content-center" key={projectRow.index}>
              {projectRow.members.map((project) => (
                <Col
                  md="12"
                  lg="4"
                  className="justify-content"
                  v-for="project in projectRow.members"
                  key={project.teamId}
                >
                  <Link href={`/projects/${project.teamId}/`}>
                    <img src={project.card} className="project-card" alt={project.name} />
                  </Link>
                </Col>
              ))}
            </Row>
          ))}
        </PageSection>
      </PageBackground>
    </Layout>
  );
}
