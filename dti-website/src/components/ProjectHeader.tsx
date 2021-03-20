import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import clsx from 'clsx';
import PageHero from './PageHero';
import ProjectGoTo from './ProjectGoTo';

type Props = { readonly project: Project };

export default function ProjectHeader({ project }: Props): JSX.Element {
  return (
    <PageHero
      className="project-header-component"
      bg={`linear-gradient(282deg, ${project.heroStartingColor}, ${project.heroEndingColor})`}
    >
      <Row className="project-hero-header-left-mobile h-100 no-gutters justify-content-center">
        <Col sm="auto" md="6" className="project-hero">
          <Row className="h-100 project-hero-header no-gutters align-items-center justify-content-end">
            <Col className="project-hero-header-left" md="10" sm="12">
              <Row className="no-gutters">
                <Col className="col-12">
                  <h3 className="project-hero-text-header">{project.header}</h3>
                  <p className="project-hero-description">
                    {project.subheader}
                  </p>
                </Col>
              </Row>
              <ProjectGoTo className="no-gutters" project={project} />
            </Col>
          </Row>
        </Col>
        <Col className="project-hero-logo col-6">
          <img
            className={clsx('product', `product-${project.teamId}`)}
            src={project.hero.image}
            alt={project.name}
          />
        </Col>
      </Row>
    </PageHero>
  );
}
