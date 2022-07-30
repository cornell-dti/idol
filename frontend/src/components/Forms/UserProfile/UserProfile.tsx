import React, { useState } from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';

const UserProfile: React.FC = () => {
  const userEmail = useUserEmail();
  const userInfoBeforeEdit = useSelf();
  const userRole = userInfoBeforeEdit?.role ?? ('' as Role);
  const isNotLead = userRole !== 'lead';

  const [firstName, setFirstName] = useState(userInfoBeforeEdit?.firstName ?? '');
  const [lastName, setLastName] = useState(userInfoBeforeEdit?.lastName ?? '');
  const [pronouns, setPronouns] = useState(userInfoBeforeEdit?.pronouns ?? '');
  const [graduation, setGraduation] = useState(userInfoBeforeEdit?.graduation ?? '');
  const [major, setMajor] = useState(userInfoBeforeEdit?.major ?? '');
  const [doubleMajor, setDoubleMajor] = useState(userInfoBeforeEdit?.doubleMajor ?? '');
  const [minor, setMinor] = useState(userInfoBeforeEdit?.minor ?? '');
  const [hometown, setHometown] = useState(userInfoBeforeEdit?.hometown ?? '');
  const [about, setAbout] = useState(userInfoBeforeEdit?.about ?? '');
  const [website, setWebsite] = useState(userInfoBeforeEdit?.website ?? '');
  const [linkedin, setLinkedin] = useState(userInfoBeforeEdit?.linkedin ?? '');
  const [github, setGithub] = useState(userInfoBeforeEdit?.github ?? '');

  const initialPronouns = userInfoBeforeEdit?.pronouns;

  const updateUser = async (member: Member): Promise<void> => {
    MembersAPI.updateMember(member).then((val) => {
      console.log(val);
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
        netid: getNetIDFromEmail(userEmail),
        email: userEmail,
        firstName,
        lastName,
        pronouns,
        role: userRole,
        roleDescription: getRoleDescriptionFromRoleID(userRole),
        graduation,
        major,
        doubleMajor: isFilledOut(doubleMajor) ? doubleMajor : null,
        minor: isFilledOut(minor) ? minor : null,
        hometown,
        about,
        website: isFilledOut(website) ? website : null,
        linkedin: isFilledOut(linkedin) ? linkedin : null,
        github: isFilledOut(github) ? github : null,
        subteams: userInfoBeforeEdit?.subteams ?? [],
        formerSubteams: userInfoBeforeEdit?.formerSubteams ?? []
      };
      updateUser(updatedUser);
    } else {
      Emitters.generalError.emit({
        headerMsg: 'Complete Required Fields',
        contentMsg: 'Please fill out all required fields!'
      });
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
        {firstName} {lastName} <span style={{ color: '#808080' }}>({initialPronouns})</span>
      </h2>
      <Form.Group>
        <Form.Input
          fluid
          width={6}
          label="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
          disabled={isNotLead}
        />
        <Form.Input
          fluid
          width={6}
          label="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
          disabled={isNotLead}
        />

        <Form.Input
          fluid
          width={4}
          label="Pronouns"
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
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

      <Form.Button onClick={saveProfileInfo} floated="right">
        Save
      </Form.Button>
    </Form>
  );
};

export default UserProfile;
