import React, { useState, useEffect } from 'react';
import { Form, Select, TextArea, Card, Image, Button, Modal } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import { ALL_COLLEGES, LEAD_ROLES } from 'common-types/constants';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';
import ImagesAPI from '../../../API/ImagesAPI';
import ProfileImageEditor from './ProfileImageEditor';
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

  const [open, setOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [editor, setEditor] = useState<null | AvatarEditor>(null);
  const setEditorRef = (editor: AvatarEditor) => setEditor(editor);

  const initialPronouns = userInfoBeforeEdit?.pronouns;
  const userInfo = useSelf();

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    ImagesAPI.getImage(`images/${userInfo ? userInfo.netid : ''}`).then((url: string) => {
      setProfilePhoto(url);
    });
  }, [userInfo]);

  /**
   * Updates member information via the API.
   * Shows success or error notifications based on the API response.
   *
   * @param member - The member object to update.
   */
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

  /**
   * Checks if a field input is non-empty after trimming whitespace.
   *
   * @param fieldInput - The string to check.
   * @returns True if the field has content, false otherwise.
   */
  const isFilledOut = (fieldInput: string): boolean => fieldInput.trim().length > 0;

  /**
   * Crops the current image from the editor, converts it to a blob,
   * uploads it to the server, and closes the modal.
   */
  const cropAndSubmitImage = () => {
    if (editor !== null) {
      const canvas = editor.getImage().toDataURL();
      let imageURL: string;
      fetch(canvas)
        .then((res) => res.blob())
        .then((blob) => {
          imageURL = window.URL.createObjectURL(blob);
          ImagesAPI.uploadImage(blob, `images/${userInfo ? userInfo.netid : ''}`);
          setProfilePhoto(imageURL);
        });
    }
    setOpen(false);
  };

  /**
   * Validates required profile fields and updates the member information.
   * Shows an error notification if required fields are empty.
   */
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
      <div
        data-testid="UserProfileImage"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '2.5vh'
        }}
      >
        <Card
          style={{
            marginRight: '2rem',
            width: 'fit-content',
            height: 'fit-content'
          }}
        >
          <Card.Content style={{ padding: '5px' }}>
            <Image
              src={profilePhoto}
              style={{ width: 180, cursor: 'pointer' }}
              onClick={() => setOpen(true)}
            />
          </Card.Content>
        </Card>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--mainFontFamily)', marginBottom: '2vh' }}>
            {firstName} {lastName} <span style={{ color: '#808080' }}>({initialPronouns})</span>
          </h2>
          <Button size="small" onClick={() => setOpen(true)} style={{ marginTop: '0.5rem' }}>
            Edit Profile Image
          </Button>
        </div>
      </div>

      <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Header>Select a Photo</Modal.Header>
        <ProfileImageEditor
          currentProfileImage={profilePhoto}
          setEditorRef={setEditorRef}
          cropAndSubmitImage={cropAndSubmitImage}
          setOpen={setOpen}
        />
      </Modal>

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
