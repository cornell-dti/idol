import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import clsx from 'clsx';
import StoreBadge from './StoreBadge';
import GitHub from '../assets/social/github.svg';

type Props = { readonly project: Project; readonly className?: string };

export default function ProjectGoTo({ project, className }: Props): JSX.Element {
  return (
    <Row className={clsx('project-goto', className)}>
      <Col className="col-auto">
        <Row>
          {project.website && (
            <Col className="col-auto">
              <Button variant="secondary" href={project.website}>
                {`Go to ${project.website_title || project.website}`}
              </Button>
            </Col>
          )}
          {project.playstore && (
            <Col className="col-auto">
              <StoreBadge store="playstore" url={project.playstore} />
            </Col>
          )}
          {project.appstore && (
            <Col className="col-auto">
              <StoreBadge store="appstore" url={project.appstore} />
            </Col>
          )}
          {project.ios_github && !project.appstore && !project.playstore && !project.website && (
            <Col className="connect-icon-container col-auto">
              <Button
                variant="secondary"
                className="align-content-center"
                href={project.ios_github}
              >
                <GitHub className="connect-icon connect-icon-blank" />
                <span className="connect-text">iOS</span>
              </Button>
            </Col>
          )}
          {project.android_github && !project.appstore && !project.playstore && !project.website && (
            <Col className="connect-icon-container col-auto">
              <Button
                variant="secondary"
                className="align-content-center"
                href={project.android_github}
              >
                <GitHub className="connect-icon connect-icon-blank" />
                <span className="connect-text">Android</span>
              </Button>
            </Col>
          )}
          {project.github && !project.appstore && !project.playstore && !project.website && (
            <Col className="connect-icon-container col-auto">
              <Button variant="secondary" className="align-content-center" href={project.github}>
                <GitHub className="connect-icon connect-icon-blank" />
                <span className="connect-text">GitHub</span>
              </Button>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}
