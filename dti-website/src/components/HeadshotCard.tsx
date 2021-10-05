import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import MissingImage from '../assets/other/missing.svg';

type Props = {
  readonly image: string;
  readonly name: string;
  readonly role?: string;
  readonly onClick?: () => void;
};

export default function HeadshotCard({ image, name, role = '', onClick }: Props): JSX.Element {
  const [foundPic, setFoundPic] = useState(true);

  return (
    <div className="headshot-card-padding" onClick={onClick}>
      <Row className="headshot-card no-gutters">
        <Col>
          <Row className="image-row no-gutters">
            <Col>
              {foundPic ? (
                <img src={image} onError={() => setFoundPic(false)} alt={name} loading="lazy" />
              ) : (
                <div className="profile-image">
                  <img src={MissingImage.src} alt="Missing" className="profile-image-missing" />
                </div>
              )}
            </Col>
          </Row>
          <Row className="info no-gutters">
            <Col>
              <Row className="h-75 no-gutters align-items-start">
                <Col className="align-self-start">
                  <div className="name">{name}</div>
                </Col>
              </Row>
              <Row className="h-25 no-gutters">
                <Col className="align-self-end">
                  {role !== '' && <div className="role">{role}</div>}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
