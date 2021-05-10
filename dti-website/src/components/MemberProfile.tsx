import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import clsx from 'clsx';
import GitHub from '../assets/social/github.svg';
import LinkedIn from '../assets/social/linkedin.svg';
import MissingImage from '../assets/other/missing.svg';

import { teams as teamsJson } from '../data/sets/teams.json';

type Props = {
  readonly profile: { readonly info: NovaMember };
  readonly className?: string;
};

interface Team {
  readonly name: string;
  readonly id: string;
}

export default function MemberProfile({ profile, className }: Props): JSX.Element {
  const [imageError, setImageError] = useState(false);

  const { subteams, formerSubteams } = profile.info;

  let allSubteams: string[];
  if (subteams && formerSubteams) allSubteams = [...subteams, ...formerSubteams];
  else if (subteams) allSubteams = subteams;
  else if (formerSubteams) allSubteams = formerSubteams;
  else allSubteams = [];

  const teams = allSubteams
    .map((team) => teamsJson.find((teamData) => teamData.id === team))
    .filter((d): d is Team => d != null);

  return (
    <Row className={clsx('member-profile-component', className)}>
      <Col>
        {imageError ? (
          <div className="profile-image rounded-circle mx-auto">
            <MissingImage className="profile-image-missing" />
          </div>
        ) : (
          <img
            className="profile-image rounded-circle mx-auto d-block"
            src={`/static/members/${profile.info.netid}.jpg`}
            alt={profile.info.name}
            onError={() => setImageError(true)}
          />
        )}
        <Row className="profile-main">
          <Col className="my-auto">
            <div className="profile-name-header">
              <div>{profile.info.name}</div>
            </div>
            <div className="profile-role text-dark">
              {profile.info.roleDescription || 'No Profile Available'}
            </div>
          </Col>
        </Row>
        {profile.info.graduation && (
          <Row className="profile-facts" id="profile-spacing">
            <Col className="col-5 profile-label">Graduating</Col>
            <Col className="col-7 profile-details">{profile.info.graduation}</Col>
          </Row>
        )}
        {profile.info.major && (
          <Row className="profile-facts">
            <Col className="col-5 profile-label">Major</Col>
            <Col className="col-7 profile-details">{profile.info.major}</Col>
          </Row>
        )}
        {profile.info.minor && profile.info.minor && (
          <Row className="profile-facts">
            <Col className="col-5 profile-label">Minor</Col>
            <Col className="col-7 profile-details">{profile.info.minor}</Col>
          </Row>
        )}
        {profile.info.hometown && (
          <Row className="profile-facts">
            <Col className="col-5 profile-label">Hometown</Col>
            <Col className="col-7 profile-details">{profile.info.hometown}</Col>
          </Row>
        )}
        {profile.info.website && (
          <Row className="profile-facts">
            <Col className="col-5 profile-label">Website</Col>
            <Col className="col-7 profile-details">
              <a className="personalwebsite" href={profile.info.website}>
                {profile.info.website}
              </a>
            </Col>
          </Row>
        )}
        {(profile.info.github || profile.info.linkedin) && (
          <div>
            <Row className="social-media">
              {profile.info.github && (
                <Col className="col-auto social-link">
                  <a href={profile.info.github}>
                    <GitHub className="social-icon" />
                  </a>
                </Col>
              )}
              {profile.info.linkedin && (
                <Col className="col-auto social-link">
                  <a href={profile.info.linkedin}>
                    <LinkedIn className="social-icon" />
                  </a>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Col>
      {(profile.info.about || profile.info.subteams) && (
        <>
          <Col lg="1" className="col-0">
            <div className="divider" />
          </Col>
          <Col lg="6" className="col-0 left-shift">
            {profile.info.about && (
              <div className="about-section">
                <Row className="about-title">
                  <Col className="member-modal-header left-space">About Me</Col>
                </Row>
                <Row>
                  <Col className="about-p left-space">{profile.info.about}</Col>
                </Row>
              </div>
            )}
            {(profile.info.subteams ||
              (profile.info.formerSubteams && profile.info.formerSubteams.length > 0)) && (
              <Row>
                <Col>
                  <div id="teamwork" className="member-modal-header left-space">
                    Team Work
                  </div>
                  <ul className="team-info-list left-space">
                    {teams.map((team) => (
                      <li className="team-info-item my-auto" key={team.id}>
                        {team.name}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            )}
          </Col>
        </>
      )}
    </Row>
  );
}
