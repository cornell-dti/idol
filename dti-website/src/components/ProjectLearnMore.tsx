import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PageSection from './PageSection';

import GitHub from '../assets/social/github.svg';

type Props = { readonly project: Project; readonly enableAll?: boolean };

export default function ProjectLearnMore({
  project: { website, playstore, appstore, github, ios_github, android_github },
  enableAll
}: Props): JSX.Element | null {
  if (
    enableAll ||
    (!website && !playstore && !appstore) ||
    ((playstore || appstore || website) && (ios_github || android_github || github))
  ) {
    return (
      <PageSection className="project-learn-more">
        <div className="project-header">Learn More</div>
        <Row>
          <Col className="col-auto">
            <Row>
              {(enableAll || website || playstore || appstore) && ios_github && (
                <Col className="connect-icon-container col-auto">
                  <Button variant="secondary" className="align-content-center" href={ios_github}>
                    <GitHub className="connect-icon connect-icon-blank" />
                    <span className="connect-text">iOS</span>
                  </Button>
                </Col>
              )}
              {(enableAll || website || playstore || appstore) && android_github && (
                <Col className="connect-icon-container col-auto">
                  <Button
                    variant="secondary"
                    className="align-content-center"
                    href={android_github}
                  >
                    <GitHub className="connect-icon connect-icon-blank" />
                    <span className="connect-text">Android</span>
                  </Button>
                </Col>
              )}
              {(enableAll || website || playstore || appstore) && github && (
                <Col className="connect-icon-container col-auto">
                  <Button variant="secondary" className="align-content-center" href={github}>
                    <GitHub className="connect-icon connect-icon-blank" />
                    <span className="connect-text">GitHub</span>
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </PageSection>
    );
  }
  return null;
}
