import React, { useEffect, useState } from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';

const UserProfile: React.FC = () => {
  const userEmail = useUserEmail();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');
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
  const [subteams, setSubteams] = useState<string[]>([]);
  const [formerSubteams, setFormerSubteams] = useState<readonly string[] | null>(null);

  useEffect(() => {
    if (userEmail) {
      MembersAPI.getMember(userEmail)
        .then((mem) => {
          setEmail(mem.email);
          setFirstName(mem.firstName);
          setLastName(mem.lastName);
          setPronouns(mem.pronouns);
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
          setSubteams([...mem.subteams]);
          setFormerSubteams(mem.formerSubteams || null);
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
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't update user!",
          contentMsg: val.error
        });
      } else {
        Emitters.generalSuccess.emit({
          headerMsg: 'Information Updated',
          contentMsg: `Member information successfully updated!`
        });
      }
    });
  };

  const isFilledOut = (fieldInput: string): boolean => fieldInput.trim().length > 0;

  const saveProfileInfo = () => {
    const requiredFields = [firstName, lastName, pronouns, graduation, major, hometown, about];
    const isValid = requiredFields.every(isFilledOut);

    if (isValid) {
      const updatedUser: Member = {
        netid: getNetIDFromEmail(email),
        email,
        firstName,
        lastName,
        pronouns,
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
        subteams,
        formerSubteams
      };
      updateUser(updatedUser);
    }
  };

  return (
    <Form
      style={{
        width: '80%',
        alignSelf: 'center',
        margin: '10vh auto'
      }}
    >
      <h2 style={{ fontFamily: 'var(--mainFontFamily)', marginBottom: '2vh' }}>
        {firstName} {lastName} {pronouns}
      </h2>
      <Form.Group>
        <Form.Input
          fluid
          width={6}
          label="First name"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          required
          disabled={role !== 'lead'}
        />
        <Form.Input
          fluid
          width={6}
          label="Last name"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
          required
          disabled={role !== 'lead'}
        />

        <Form.Input
          fluid
          width={4}
          label="Pronouns"
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
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

      <Form.Button onClick={saveProfileInfo} floated="right">
        Save
      </Form.Button>
    </Form>
  );
};

export default UserProfile;
