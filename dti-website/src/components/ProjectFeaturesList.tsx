import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PageSection from './PageSection';

type Props = { readonly project: Project };

export default function ProjectFeaturesList({ project }: Props): JSX.Element {
  const [feature1, feature2, feature3, feature4, feature5] = project.features;

  return (
    <PageSection className="project-features-list">
      <div className="project-header">Features</div>
      {feature1 && (
        <Row className="mobile-space align-items-center">
          <Col md="7">
            <div className="feature-header mobile">{feature1.title}</div>
            <img className="product" src={feature1.image} alt={feature1.title} />
          </Col>
          <Col md="5">
            <div className="feature-header hide">{feature1.title}</div>
            <div className="project-description">{feature1.description}</div>
          </Col>
        </Row>
      )}
      <Row className="feature-padding" />
      {feature2 && (
        <Row className="mobile-space align-items-center">
          <Col md="5" className="switch1">
            <div className="feature-header hide">{feature2.title}</div>
            <div className="project-description">{feature2.description}</div>
          </Col>
          <Col md="7" className="switch2">
            <div className="feature-header mobile">{feature2.title}</div>
            <img className="product" src={feature2.image} alt={feature2.title} />
          </Col>
        </Row>
      )}
      <Row className="feature-padding" />
      {feature3 && (
        <Row className="mobile-space align-items-center">
          <Col md="7">
            <div className="feature-header mobile">{feature3.title}</div>
            <img className="product" src={feature3.image} alt={feature3.title} />
          </Col>
          <Col md="5">
            <div className="feature-header hide">{feature3.title}</div>
            <div className="project-description">{feature3.description}</div>
          </Col>
        </Row>
      )}
      <Row className="feature-padding" />
      {feature4 && (
        <Row className="mobile-space align-items-center">
          <Col md="5" className="switch1">
            <div className="feature-header hide">{feature4.title}</div>
            <div className="project-description">{feature4.description}</div>
          </Col>
          <Col md="7" className="switch2">
            <div className="feature-header mobile">{feature4.title}</div>
            <img className="product" src={feature4.image} alt={feature4.title} />
          </Col>
        </Row>
      )}
      <Row className="feature-padding" />
      {feature5 && (
        <Row className="mobile-space align-items-center">
          <Col md="7">
            <div className="feature-header mobile">{feature5.title}</div>
            <img className="product" src={feature5.image} alt={feature5.title} />
          </Col>
          <Col md="5">
            <div className="feature-header hide">{feature5.title}</div>
            <div className="project-description">{feature5.description}</div>
          </Col>
        </Row>
      )}
    </PageSection>
  );
}
