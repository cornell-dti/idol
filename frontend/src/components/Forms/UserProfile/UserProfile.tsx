import React, { useState } from 'react';
import { Form, Select, TextArea } from 'semantic-ui-react';
import { ALL_COLLEGES, LEAD_ROLES, ALL_MAJORS, ALL_MINORS } from 'common-types/constants';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';
import styles from './UserProfile.module.css';

const UserProfile: React.FC = () => {
  const userEmail = useUserEmail();
  const userInfoBeforeEdit = useSelf();
  const userRole = userInfoBeforeEdit?.role ?? ('' as Role);
  const isNotLead = !LEAD_ROLES.includes(userRole);

  const [firstName, setFirstName] = useState(userInfoBeforeEdit?.firstName ?? '');
  const [lastName, setLastName] = useState(userInfoBeforeEdit?.lastName ?? '');
  const [pronouns, setPronouns] = useState(userInfoBeforeEdit?.pronouns ?? '');
  const [semesterJoined, setSemesterJoined] = useState(userInfoBeforeEdit?.semesterJoined ?? '');
  const [graduation, setGraduation] = useState(userInfoBeforeEdit?.graduation ?? '');
  const [major, setMajor] = useState(userInfoBeforeEdit?.major ?? '');
  const [doubleMajor, setDoubleMajor] = useState(userInfoBeforeEdit?.doubleMajor ?? '');
  const [minor, setMinor] = useState(userInfoBeforeEdit?.minor ?? '');
  const [college, setCollege] = useState(userInfoBeforeEdit?.college ?? '');
  const [hometown, setHometown] = useState(userInfoBeforeEdit?.hometown ?? '');
  const [about, setAbout] = useState(userInfoBeforeEdit?.about ?? '');
  const [website, setWebsite] = useState(userInfoBeforeEdit?.website ?? '');
  const [linkedin, setLinkedin] = useState(userInfoBeforeEdit?.linkedin ?? '');
  const [github, setGithub] = useState(userInfoBeforeEdit?.github ?? '');
  const [coffeeChatLink, setCoffeeChatLink] = useState(userInfoBeforeEdit?.coffeeChatLink ?? '');

  const initialPronouns = userInfoBeforeEdit?.pronouns;

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
    const requiredFields = [
      firstName,
      lastName,
      pronouns,
      semesterJoined,
      college,
      graduation,
      major,
      hometown,
      about
    ];
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
        semesterJoined,
        graduation,
        major,
        doubleMajor: isFilledOut(doubleMajor) ? doubleMajor : null,
        minor: isFilledOut(minor) ? minor : null,
        college: college as College,
        hometown,
        about,
        website: isFilledOut(website) ? website : null,
        linkedin: isFilledOut(linkedin) ? linkedin : null,
        github: isFilledOut(github) ? github : null,
        coffeeChatLink: isFilledOut(coffeeChatLink) ? coffeeChatLink : null,
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
          label="Semester Joined"
          value={semesterJoined}
          onChange={(event) => setSemesterJoined(event.target.value)}
          required
          disabled={isNotLead}
        />
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
        <Form.Dropdown
          fluid
          label="Major"
          search
          selection
          options={ALL_MAJORS.map((val) => ({ key: val, text: val, value: val }))}
          placeholder="Search majors..."
          value={major}
          onChange={(event, data) => {
            setMajor(data.value as Major);
            setTimeout(() => {
              const inputElement = (event.target as HTMLInputElement)
                .closest('.ui.dropdown')
                ?.querySelector('input.search') as HTMLInputElement | null;
              if (inputElement) {
                inputElement.blur();
              }
            }, 0);
          }}
          required
        />
        <Form.Dropdown
          fluid
          label="Double Major"
          search
          selection
          options={[
            { key: 'none', text: 'N/A', value: '' },
            ...ALL_MAJORS.map((val) => ({ key: val, text: val, value: val }))
          ]}
          placeholder="Search double majors..."
          value={doubleMajor || ''}
          onChange={(event, data) => {
            setDoubleMajor(data.value as Major);
            setTimeout(() => {
              const inputElement = (event.target as HTMLInputElement)
                .closest('.ui.dropdown')
                ?.querySelector('input.search') as HTMLInputElement | null;
              if (inputElement) {
                inputElement.blur();
              }
            }, 0);
          }}
        />
        <Form.Dropdown
          fluid
          label="Minor"
          search
          selection
          options={[
            { key: 'none', text: 'N/A', value: '' },
            ...ALL_MINORS.map((val) => ({ key: val, text: val, value: val }))
          ]}
          placeholder="Search minors..."
          value={minor || ''}
          onChange={(event, data) => {
            setMinor(data.value as Minor);
            setTimeout(() => {
              const inputElement = (event.target as HTMLInputElement)
                .closest('.ui.dropdown')
                ?.querySelector('input.search') as HTMLInputElement | null;
              if (inputElement) {
                inputElement.blur();
              }
            }, 0);
          }}
        />
        <Form.Input
          control={Select}
          label="College"
          value={college}
          options={ALL_COLLEGES.map((val) => ({ key: val, text: val, value: val }))}
          placeholder="Select college"
          onChange={(event, data) => {
            setCollege(data.value);
          }}
          required
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
        <Form.Input
          fluid
          label="Coffee Chat Calendly *"
          value={coffeeChatLink}
          onChange={(event) => setCoffeeChatLink(event.target.value)}
        />
      </Form.Group>
      <span className={styles.coffeeChatLinkFootnote}>
        *If coffee chat link not provided, your email will be displayed.
      </span>
      <Form.Button onClick={saveProfileInfo} floated="right">
        Save
      </Form.Button>
    </Form>
  );
};

export default UserProfile;
