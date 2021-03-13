import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import Facebook from '../assets/social/facebook.svg';
import GitHub from '../assets/social/github.svg';
import GooglePlay from '../assets/social/google-play.svg';
import AppStore from '../assets/social/app-store.svg';
import Medium from '../assets/social/medium.svg';
import Heart from '../assets/footer/heart.svg';
import HeartMobile from '../assets/footer/heart-mobile.svg';

import MailChimpForm from './MailChimpForm';

type Props = { readonly hideSubfooter?: boolean };

export default function DtiFooter({
  hideSubfooter = false
}: Props): JSX.Element {
  const [isSubscribing, setIsSubscribing] = useState(false);

  return (
    <div className="dti-footer">
      <Container fluid className="h-100">
        {!hideSubfooter && (
          <Row className="subfooter align-items-start">
            <Col className="col-12">
              <Row className="row subfooter-wrapper align-items-start justify-content-end subfooter-wrapper">
                <Col className="subfooter-col" md="6" sm="6">
                  <div className="subfooter-text subfooter-text-gray">
                    Have a great idea?
                  </div>
                  <a
                    className="button-wrapper"
                    href="mailto:hello@cornelldti.org"
                  >
                    <button className="subfooter-button subfooter-button-gray">
                      Contact Us
                    </button>
                  </a>
                </Col>
                <Col className="subfooter-col" md="6" sm="6">
                  <div className="subfooter-text subfooter-text-red">
                    Sign up for our newsletter!
                  </div>
                  <a className="button-wrapper">
                    <button
                      onClick={() => setIsSubscribing(true)}
                      className="subfooter-button subfooter-button-red"
                    >
                      Subscribe
                    </button>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        <Row className="footer align-items-start">
          <Col className="col-12">
            <Row className="footer-row  align-items-center">
              <Col lg="12" xl="6">
                <Row className="justify-content-start">
                  <img
                    className="brand"
                    src="/static/branding/wordmark.png"
                    alt=""
                  />
                </Row>
              </Col>
              <Col lg="12" xl="6" className="social-icons-wrapper">
                <Row className="social-icons">
                  <Col className="col-auto social-icon-wrapper">
                    <a href="https://www.facebook.com/cornelldti/">
                      <Facebook className="social-icon social-icon-blank" />
                    </a>
                  </Col>
                  <Col className="col-auto social-icon-wrapper">
                    <a href="https://github.com/cornell-dti/">
                      <GitHub className="social-icon social-icon-blank" />
                    </a>
                  </Col>
                  <Col className="col-auto social-icon-wrapper">
                    <a href="https://play.google.com/store/apps/dev?id=8943927778040647949">
                      <GooglePlay className="social-icon social-icon-blank" />
                    </a>
                  </Col>
                  <Col className="col-auto social-icon-wrapper">
                    <a href="http://appstore.com/cornelldti">
                      <AppStore className="social-icon social-icon-blank" />
                    </a>
                  </Col>
                  <Col className="col-auto social-icon-wrapper">
                    <a href="https://medium.com/cornelldti">
                      <Medium className="social-icon social-icon-blank" />
                    </a>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="bottom justify-content-end">
              <div className="copyright">
                &copy; {new Date().getUTCFullYear()} Cornell Design &amp; Tech
                Initiative
              </div>
              <span className="divider"></span>
              <div className="attribution">
                {`Made with`}
                <Heart className="heart-desktop" title="love" />
                <HeartMobile className="heart-mobile" title="love" />
                {` in Ithaca`}
              </div>
            </Row>
          </Col>
        </Row>
        <Modal show={isSubscribing} onHide={() => setIsSubscribing(false)}>
          <Modal.Body>
            <Container fluid>
              <Row>
                <Col className="col-auto">
                  <h2 className="form-header">Subscribe to our newsletter!</h2>
                </Col>
                <Col>
                  <Button
                    className="modal-close-button close"
                    onClick={() => setIsSubscribing(false)}
                  >
                    x
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <MailChimpForm />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
