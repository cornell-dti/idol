import { CSSProperties, ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PageSection from './PageSection';

type Props = {
  readonly header?: string;
  readonly subheader?: string;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
};

export default function TextHero({ header, subheader, style, children }: Props): JSX.Element {
  return (
    <PageSection style={style}>
      <Row className="justify-content-center">
        <Col sm="12" md="11">
          <div className="text-hero-header text-center">{header}</div>
        </Col>
        <Col sm="12" md="8">
          <div className="text-hero-header-subtext text-center">
            {children}
            {subheader}
          </div>
        </Col>
      </Row>
    </PageSection>
  );
}
