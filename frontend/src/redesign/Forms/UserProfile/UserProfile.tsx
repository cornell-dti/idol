import Head from 'next/head';
import { ALL_COLLEGES, ALL_MAJORS, ALL_MINORS } from 'common-types/constants';
import {
  Avatar,
  Button,
  Card,
  Input,
  Select,
  Textarea
} from '../../../design-system-2026/components';
import { CheckIcon } from '../../../design-system-2026/icons';
import { Combobox } from '../../../design-system-2026/components/Combobox/Combobox';
import useProfileEditor from '../../../components/Forms/UserProfile/useProfileEditor';
import ProfileImageModal from './ProfileImageModal';
import styles from './UserProfile.module.css';
import SocialInput from './SocialInput';

const collegeLabels: Record<College, string> = {
  eng: 'Engineering',
  cas: 'Arts & Sciences',
  cals: 'Agriculture & Life Sciences',
  dyson: 'Dyson',
  humec: 'Human Ecology',
  hotel: 'Hotel Administration',
  ilr: 'Industrial & Labor Relations',
  brooks: 'Public Policy',
  aap: 'Architecture, Art & Planning'
};

export default function UserProfile(): JSX.Element {
  const profile = useProfileEditor();
  const { isNotLead } = profile;
  return (
    <form
      className={styles.page}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        profile.saveProfileInfo();
      }}
    >
      <Head>
        <title>Profile · IDOL</title>
      </Head>
      <h1 className="idol-heading-1">Profile</h1>
      <Card header="Profile picture">
        <div className={styles.photo} data-testid="UserProfileImage">
          <button
            type="button"
            className={styles.avatarButton}
            aria-label="Edit profile picture"
            onClick={() => profile.setOpen(true)}
          >
            <Avatar
              name={`${profile.firstName} ${profile.lastName}`}
              src={profile.profilePhoto}
              size={96}
            />
          </button>
          <ProfileImageModal profile={profile} />
        </div>
      </Card>
      <Card header="Personal information">
        <div className={styles.grid}>
          <Input
            id="profile-first-name"
            label="First name"
            value={profile.firstName}
            onChange={(e) => profile.setFirstName(e.target.value)}
            required
            disabled={isNotLead}
          />
          <Input
            id="profile-last-name"
            label="Last name"
            value={profile.lastName}
            onChange={(e) => profile.setLastName(e.target.value)}
            required
            disabled={isNotLead}
          />
          <Input
            id="profile-pronouns"
            label="Pronouns"
            value={profile.pronouns}
            onChange={(e) => profile.setPronouns(e.target.value)}
            required
          />
          <Input
            id="profile-hometown"
            label="Hometown"
            value={profile.hometown}
            onChange={(e) => profile.setHometown(e.target.value)}
            required
          />
        </div>
      </Card>
      <Card header="Academic information">
        <div className={styles.grid}>
          <Input
            id="profile-semester"
            label="Semester joined"
            value={profile.semesterJoined}
            onChange={(e) => profile.setSemesterJoined(e.target.value)}
            required
            disabled={isNotLead}
          />
          <Input
            id="profile-graduation"
            label="Graduation date"
            value={profile.graduation}
            onChange={(e) => profile.setGraduation(e.target.value)}
            required
          />
          <Select
            id="profile-college"
            label="College"
            options={ALL_COLLEGES.map((value) => ({ value, label: collegeLabels[value] }))}
            value={profile.college}
            onValueChange={(value) => profile.setCollege(value ?? '')}
            required
          />
          <Combobox
            id="profile-major"
            label="Major"
            options={ALL_MAJORS}
            value={profile.major}
            onValueChange={profile.setMajor}
            placeholder="Search majors..."
            required
          />
          <Combobox
            id="profile-double-major"
            label="Double major"
            options={['', ...ALL_MAJORS]}
            value={profile.doubleMajor}
            onValueChange={profile.setDoubleMajor}
            placeholder="Search double majors..."
          />
          <Combobox
            id="profile-minor"
            label="Minor"
            options={['', ...ALL_MINORS]}
            value={profile.minor}
            onValueChange={profile.setMinor}
            placeholder="Search minors..."
          />
        </div>
      </Card>
      <Card header="About you">
        <Textarea
          id="profile-about"
          label="Bio"
          value={profile.about}
          onChange={(e) => profile.setAbout(e.target.value)}
          required
          className={styles.bio}
        />
      </Card>
      <Card header="Socials">
        <div className={styles.grid}>
          <SocialInput
            kind="website"
            id="profile-website"
            label="Website"
            value={profile.website}
            onChange={profile.setWebsite}
          />
          <SocialInput
            kind="linkedin"
            id="profile-linkedin"
            label="LinkedIn"
            value={profile.linkedin}
            onChange={profile.setLinkedin}
          />
          <SocialInput
            kind="github"
            id="profile-github"
            label="GitHub"
            value={profile.github}
            onChange={profile.setGithub}
          />
          <SocialInput
            kind="calendly"
            id="profile-coffee-chat"
            label="Coffee chat Calendly"
            value={profile.coffeeChatLink}
            onChange={profile.setCoffeeChatLink}
            hint="If no coffee chat link is provided, your email will be displayed."
          />
        </div>
      </Card>
      <div className={styles.actions}>
        <Button
          type="submit"
          icon={<CheckIcon size={16} aria-hidden="true" />}
          disabled={!profile.hasProfileChanges || profile.savingProfile}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}
