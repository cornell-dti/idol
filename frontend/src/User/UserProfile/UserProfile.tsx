import React, { useContext, useEffect, useState } from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { UserContext } from '../../UserProvider/UserProvider';
import {
  Member,
  MembersAPI,
  Role,
  RoleDescription
} from '../../API/MembersAPI';
import Emitters from '../../EventEmitter/constant-emitters';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID } from '../../utils';

const UserProfile: React.FC = () => {
  const userEmail = useContext(UserContext).user?.email;

  const getUser = async (email: string): Promise<Member> => {
    const mem = await MembersAPI.getMember(email);
    return mem;
  };

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('' as Role);
  const [graduation, setGraduation] = useState('');
  const [major, setMajor] = useState('');
  const [doubleMajor, setDoubleMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [hometown, setHometown] = useState('');
  const [about, setAbout] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [subteam, setSubteam] = useState('');
  const [otherSubteams, setOtherSubteams] = useState<string[] | null>(null);

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail)
        .then((mem) => {
          setEmail(mem.email);
          setFirstName(mem.firstName);
          setLastName(mem.lastName);
          setRole(mem.role);
          setGraduation(mem.graduation);
          setMajor(mem.major);
          setDoubleMajor(mem.doubleMajor || '');
          setMinor(mem.minor || '');
          setHometown(mem.hometown);
          setAbout(mem.about);
          setWebsite(mem.website || '');
          setLinkedin(mem.linkedin || '');
          setGithub(mem.github || '');
          setSubteam(mem.subteam);
          setOtherSubteams(mem.otherSubteams);
        })
        .catch((error) => {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get member!",
            contentMsg: `Error was: ${error}`
          });
        });
    }
  }, [userEmail]);

  const updateUser = async (member: Member): Promise<void> => {
    MembersAPI.updateMember(member).then((val) => {
      if (val.status === 200) {
        alert('Member information successfully updated!');
      } else if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't update user!",
          contentMsg: val.error
        });
      }
    });
  };

  const isFilledOut = (fieldInput: string): boolean =>
    fieldInput.trim().length > 0;

  const saveProfileInfo = () => {
    const requiredFields = [
      firstName,
      lastName,
      graduation,
      major,
      hometown,
      about
    ];
    const isValid = requiredFields.every(isFilledOut);

    if (isValid) {
      const updatedUser: Member = {
        netid: getNetIDFromEmail(email),
        email,
        firstName,
        lastName,
        role,
        roleDescription: getRoleDescriptionFromRoleID(role),
        graduation,
        major,
        doubleMajor: isFilledOut(doubleMajor) ? doubleMajor : null,
        minor: isFilledOut(minor) ? minor : null,
        hometown,
        about,
        website: isFilledOut(website) ? website : null,
        linkedin: isFilledOut(linkedin) ? linkedin : null,
        github: isFilledOut(github) ? github : null,
        subteam,
        otherSubteams
      };
      updateUser(updatedUser);
    }
  };

  return (
    <Form
      style={{
        width: '80%',
        alignSelf: 'center',
        margin: 'auto',
        marginTop: '10vh'
      }}
    >
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="First name"
          value={firstName}
          onChange={(event) => {
            if (role === 'admin') {
              setFirstName(event.target.value);
            }
          }}
          required
        />
        <Form.Input
          fluid
          label="Last name"
          value={lastName}
          onChange={(event) => {
            if (role === 'admin') {
              setLastName(event.target.value);
            }
          }}
          required
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="Graduation"
          value={graduation}
          onChange={(event) => setGraduation(event.target.value)}
          required
        />
        <Form.Input
          fluid
          label="Hometown"
          value={hometown}
          onChange={(event) => setHometown(event.target.value)}
          required
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="Major"
          value={major}
          onChange={(event) => setMajor(event.target.value)}
          required
        />
        <Form.Input
          fluid
          label="Double Major"
          value={doubleMajor || ''}
          onChange={(event) => setDoubleMajor(event.target.value)}
        />
        <Form.Input
          fluid
          label="Minor"
          value={minor}
          onChange={(event) => setMinor(event.target.value)}
        />
      </Form.Group>

      <Form.Input
        label="About"
        name="about"
        value={about}
        control={TextArea}
        onChange={(event) => setAbout(event.target.value)}
        style={{ minHeight: '25vh' }}
        required
      />

      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="Website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
        <Form.Input
          fluid
          label="LinkedIn"
          value={linkedin}
          onChange={(event) => setLinkedin(event.target.value)}
        />
        <Form.Input
          fluid
          label="GitHub"
          value={github}
          onChange={(event) => setGithub(event.target.value)}
        />
      </Form.Group>

      <Form.Button onClick={saveProfileInfo}>Save</Form.Button>
    </Form>
  );
};

export default UserProfile;
