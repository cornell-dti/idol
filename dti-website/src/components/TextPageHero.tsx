import { CSSProperties, ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PageHero from './PageHero';

type Props = { readonly style?: CSSProperties; readonly children: ReactNode };

export default function TextPageHero({ style, children }: Props): JSX.Element {
  return (
    <PageHero style={style}>
      <Row className="justify-content-center h-50 no-gutters">
        <Col className="col-auto my-auto">
          <h2 className="text-header">{children}</h2>
        </Col>
      </Row>
    </PageHero>
  );
}
