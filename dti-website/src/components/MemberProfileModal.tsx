import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import MemberProfile from './MemberProfile';

type Props = {
  readonly profile: { readonly info: NovaMember };
  readonly open: boolean;
  readonly onClose: () => void;
  readonly isStatic?: boolean;
};

export default function MemberProfileModal({
  profile,
  open,
  onClose,
  isStatic = false
}: Props): JSX.Element {
  return (
    <div style={{ display: open ? 'block' : 'none' }}>
      <Modal
        show={open}
        onHide={onClose}
        lazy
        no-fade
        centered
        size="lg"
        id="memberModal"
        static={isStatic}
        title={profile && profile.info ? profile.info.name : 'not found'}
        header-bg-variant="light"
        header-text-variant="dark"
        body-bg-variant="light"
        body-text-variant="dark"
        footer-bg-variant="light"
        footer-text-variant="dark"
        header-border-variant="light"
        footer-border-variant="light"
      >
        <div className="modal-body">
          <Container fluid>
            <Row>
              <Col>
                <Button variant="secondary" className="modal-close-button close" onClick={onClose}>
                  x
                </Button>
              </Col>
            </Row>
            {profile && profile.info && (
              <MemberProfile className="modal-scroll" profile={profile} />
            )}
          </Container>
        </div>
      </Modal>
    </div>
  );
}
