import { ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

type Props = {
  readonly header: string;
  readonly rightHeader: string;
  readonly children?: ReactNode;
};

export default function TimelineSection({ header, rightHeader, children }: Props): JSX.Element {
  return (
    <section className="timeline-section">
      <Row className="timeline-header align-items-center">
        <Col className="left-col-text" md="auto" sm="12">
          <div className="container-section-heading">{header}</div>
        </Col>
        <Col sm="12" md className="right-col-text align-self-end">
          {rightHeader}
        </Col>
      </Row>
      <div className="timeline-content">{children}</div>
    </section>
  );
}
