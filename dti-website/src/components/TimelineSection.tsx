import { ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

type Props = {
  readonly header: string;
  readonly children?: ReactNode;
};

export default function TimelineSection({ header, children }: Props): JSX.Element {
  return (
    <section className="timeline-section">
      <Row className="timeline-header align-items-center">
        <Col className="left-col-text" md="auto" sm="12">
          <div className="container-section-heading">{header}</div>
        </Col>
      </Row>
      <div className="timeline-content">{children}</div>
    </section>
  );
}
