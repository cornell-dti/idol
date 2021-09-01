import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from '../components/Layout';
import NovaHero from '../components/NovaHero';
import PageBackground from '../components/PageBackground';
import PageSection from '../components/PageSection';
import RoleSelector, { RoleId } from '../components/RoleSelector';
import TimelineSection from '../components/TimelineSection';

import content from '../data/apply.json';

interface ApplyType {
  readonly header: string;
  readonly sections: readonly {
    readonly header: string;
    readonly content: string;
  }[];
  readonly callToActionButtons?: {
    readonly closed: boolean;
    readonly link: string;
    readonly label: string;
  }[];
}

const videos = {
  webm: 'https://d2ytxic79evey7.cloudfront.net/pages/apply/hero/hero.webm',
  mp4: 'https://d2ytxic79evey7.cloudfront.net/pages/apply/hero/hero.mp4'
};

export default function ApplyPage(): JSX.Element {
  const [roleId, setRoleId] = useState<RoleId>('');

  const isOpen = content.applicationsOpen;
  const sessions = content.infoSessions;

  const sections = ((): readonly (ApplyType & { id: string })[] => {
    const info = content.applicationInfo.find((a) => a.id === roleId);

    if (!info) {
      return [];
    }

    return [
      { id: 'apply', ...info.apply },
      { id: 'nextSteps', ...info.nextSteps },
      { id: 'decision', ...info.decision }
    ];
  })();

  return (
    <Layout className="apply-page" title="Apply">
      <PageBackground>
        {isOpen ? (
          <NovaHero
            header="Join Us"
            subheader="In every applicant, we above all look for people that want to use their talents and skills to make a difference. No matter your experience, we also strive to be as inclusive as possible and give passionate people a chance to grow and learn with us."
            video={videos}
            lazy="/static/pages/apply-hero-lazy.jpg"
            image="/static/pages/apply-hero.png"
          />
        ) : (
          <NovaHero
            video={videos}
            lazy="/static/pages/apply-hero-lazy.jpg"
            image="/static/pages/apply-hero.png"
          />
        )}
        {!isOpen && (
          <PageSection>
            <Container className="email-form">
              <Row className="no-gutters justify-content-center">
                <Col className="col-auto">
                  <h2 className="email-header">Applications are currently closed.</h2>
                </Col>
              </Row>
            </Container>
          </PageSection>
        )}
        {isOpen && (
          <Row className="justify-content-center timeline">
            <Col className="text-center timeline-header" sm="12">
              <div className="header">Timeline</div>
              <div className="subheader">{content.semester}</div>
            </Col>
            {content.timelines.map((timeline) => (
              <Col key={timeline.name} className="timeline-details" sm="12" md="6" md-offset="1">
                <Row className="h-100 justify-content-center align-items-center">
                  <Col className="col-auto">
                    <div className="timeline h-50">
                      <div className="title">{timeline.name}</div>
                      {timeline.events.map((event) => (
                        <div className="event">
                          <div className="label">{event.label}</div>
                          <div className="time">{event.time}</div>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        )}
        {isOpen && (
          <Row className="justify-content-center info-session-interjection">
            <Col className="info-session-description" sm="12" md="4" md-offset="1">
              <div className="header">Information Sessions!</div>
              <div className="subheader">{content.semester}</div>
              <div className="description">
                Come say hello! You'll have the opportunity to learn more about our team, hear from
                current members about the exciting work they do, and have the opportunity to chat to
                people about roles you're interested in!
              </div>
            </Col>
            <Col className="info-session-details" sm="12" md="auto" md-offset="1">
              <Row className="h-100 justify-content-center align-items-center">
                <Col className="col-auto">
                  {sessions.map((session) => (
                    <div key={session.time} className="info-session h-50">
                      <div className="time">{session.time}</div>
                      <div className="location location-desktop">
                        {`${session.location}${session.link && session.link.url ? ' • ' : ''}`}
                        {session.link && session.link.url && (
                          <a className="apply-link" href={session.link.url}>
                            {session.link.text}
                          </a>
                        )}
                      </div>
                      <div className="location location-mobile">
                        {`${session.location}`}
                        <br />
                        {session.link && session.link.url && (
                          <a className="apply-link" href={session.link.url}>
                            {session.link.text}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        {isOpen && (
          <Row className="justify-content-center coffee-chat">
            <Col className="info-session-description" sm="12" md="4" md-offset="1">
              <div className="header">Coffee Chats</div>
              <div className="subheader">{content.semester}</div>
              <div className="description">
                Sign up to chat with some members on the team! You can learn more about what we do
                by sending an email to any of the members on the spreadsheet.
              </div>
            </Col>
            <Col className="info-session-details" sm="12" md="auto" md-offset="1">
              <Row className="h-100 justify-content-center align-items-center">
                <Col className="col-auto">
                  <div className="info-session h-50">
                    <div className="time">
                      Sign up at{' '}
                      <a href="https://docs.google.com/spreadsheets/d/1xvFotNdMkCc4vaBv_LYTA8LHNIQfYlYaMIW3DUZYAvA/edit#gid=0">
                        this link
                      </a>{' '}
                      to chat!
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        <Container>
          <Row className="justify-content-center selector-header">Applications 👇</Row>
          <RoleSelector
            roleId={roleId}
            onRoleIdChange={setRoleId}
            className="application-role-selector"
            dropdownText="I want to apply for..."
            centered={true}
            bold={true}
            showAll={false}
          />
          {sections.map((info) => (
            <TimelineSection key={info.id} header={info.header}>
              {info.sections.map((section) => (
                <div key={section.header}>
                  <div className="apply-header">{section.header}</div>
                  <div className="apply-description">{section.content}</div>
                </div>
              ))}
              <Row className="justify-content-center">
                <Col className="col-12">
                  <Row>
                    {info.callToActionButtons?.map(({ link, label }) => (
                      <Col key={label} md="auto" sm="12">
                        <Button
                          href={link}
                          size="lg"
                          variant="primary"
                          className="call-to-action-button text-start"
                        >
                          {label}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </TimelineSection>
          ))}
        </Container>
      </PageBackground>
    </Layout>
  );
}
