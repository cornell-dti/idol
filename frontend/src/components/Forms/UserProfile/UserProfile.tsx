import React from 'react';
import { Form, Select, TextArea, Card, Image, Button, Modal } from 'semantic-ui-react';
import { ALL_COLLEGES, ALL_MAJORS, ALL_MINORS } from 'common-types/constants';
import ProfileImageEditor from './ProfileImageEditor';
import useProfileEditor from './useProfileEditor';
import styles from './UserProfile.module.css';

const UserProfile: React.FC = () => {
  const {
    isNotLead,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    pronouns,
    setPronouns,
    semesterJoined,
    setSemesterJoined,
    graduation,
    setGraduation,
    major,
    setMajor,
    doubleMajor,
    setDoubleMajor,
    minor,
    setMinor,
    college,
    setCollege,
    hometown,
    setHometown,
    about,
    setAbout,
    website,
    setWebsite,
    linkedin,
    setLinkedin,
    github,
    setGithub,
    coffeeChatLink,
    setCoffeeChatLink,
    open,
    setOpen,
    profilePhoto,
    setEditorRef,
    initialPronouns,
    cropAndSubmitImage,
    saveProfileInfo,
    hasProfileChanges,
    savingProfile
  } = useProfileEditor();

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
      <Form.Button
        onClick={saveProfileInfo}
        floated="right"
        disabled={!hasProfileChanges || savingProfile}
      >
        Save
      </Form.Button>
    </Form>
  );
};

export default UserProfile;
