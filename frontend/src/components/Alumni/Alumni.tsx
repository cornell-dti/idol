import React, { useState, useEffect } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { Emitters } from '../../utils';
import AlumniAPI from '../../API/AlumniAPI';

const Alumni: React.FC = () => {
  const [alumni, setAlumni] = useState<readonly Alumni[]>([]);

  useEffect(() => {
    AlumniAPI.getAllAlumni()
      .then((alumniData) => {
        setAlumni(alumniData);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't load alumni data!",
          contentMsg: `Error was: ${error}`
        });
      });
  }, []);

  return (
    <Container>
      <Header as="h1" textAlign="center">
        Alumni Database
      </Header>

      {alumni?.map((alum) => (
        <Segment key={alum.uuid}>
          <Header as="h3">
            {alum.firstName} {alum.lastName}
          </Header>
          {alum.imageUrl && (
            <img
              src={alum.imageUrl}
              alt={`${alum.firstName} ${alum.lastName}`}
              width="120"
              height="120"
            />
          )}
          <p>
            <strong>Email:</strong> {alum.email}
          </p>
          <p>
            <strong>Graduation Year:</strong> {alum.gradYear || 'N/A'}
          </p>
          {alum.dtiRoles && alum.dtiRoles.length > 0 && (
            <p>
              <strong>DTI Roles:</strong> {alum.dtiRoles.join(', ')}
            </p>
          )}
          {alum.subteams && alum.subteams.length > 0 && (
            <p>
              <strong>Subteams:</strong> {alum.subteams.join(', ')}
            </p>
          )}
          <p>
            <strong>Company:</strong> {alum.company || 'N/A'}
          </p>
          <p>
            <strong>Current Role:</strong> {alum.jobRole}
          </p>
          <p>
            <strong>Location:</strong> {alum.location || 'N/A'}
          </p>
          {alum.linkedin && (
            <p>
              <strong>LinkedIn:</strong>{' '}
              <a href={alum.linkedin} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </p>
          )}
        </Segment>
      ))}
    </Container>
  );
};

export default Alumni;
