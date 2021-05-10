import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

type Props = {
  readonly image: string;
  readonly header: string;
  readonly subheader: string;
  readonly link: string;
};

export default function QuickLink({ image, header, subheader, link }: Props): JSX.Element {
  return (
    <Row noGutters>
      <Col className="col-12">
        <div
          className="quicklink-container"
          style={{ backgroundSize: 'cover', backgroundImage: `url(${image})` }}
        >
          <div className="quicklink-overlay" />
          <div className="quicklink-visual-dimensions">
            <a href={link}>
              <div className="quicklink-internal">
                <div className="quicklink-text quicklink-text-header">{header}</div>
                <div className="quicklink-text quicklink-text-subheader">{subheader}</div>
              </div>
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
}
