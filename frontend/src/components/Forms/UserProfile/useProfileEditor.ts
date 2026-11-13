import { useState, useEffect, useCallback, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { LEAD_ROLES } from 'common-types/constants';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';
import ImagesAPI from '../../../API/ImagesAPI';

const EDITABLE_FIELDS = [
  'firstName',
  'lastName',
  'pronouns',
  'semesterJoined',
  'graduation',
  'major',
  'doubleMajor',
  'minor',
  'college',
  'hometown',
  'about',
  'website',
  'linkedin',
  'github',
  'coffeeChatLink'
] as const;

// Empty optional inputs are saved as null; compare them as the same value.
const getProfileValues = (member: Partial<Member>) =>
  EDITABLE_FIELDS.map((field) => (member[field]?.trim() ? member[field] : ''));

export default function useProfileEditor() {
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

  const [savedValues, setSavedValues] = useState(() => getProfileValues(userInfoBeforeEdit ?? {}));
  const [savingProfile, setSavingProfile] = useState(false);
  const saveInFlight = useRef(false);
  const hasProfileChanges = getProfileValues({
    firstName,
    lastName,
    pronouns,
    semesterJoined,
    graduation,
    major,
    doubleMajor,
    minor,
    college: college as College,
    hometown,
    about,
    website,
    linkedin,
    github,
    coffeeChatLink
  }).some((value, index) => value !== savedValues[index]);

  const [open, setOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [editor, setEditor] = useState<null | AvatarEditor>(null);
  const setEditorRef = useCallback((editor: AvatarEditor | null) => setEditor(editor), []);
  const [savingPhoto, setSavingPhoto] = useState(false);

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
   * Shows success or error notifications based on the API's response.
   *
   * @param member - The member object to update.
   */
  const updateUser = async (member: Member): Promise<void> => {
    saveInFlight.current = true;
    setSavingProfile(true);
    try {
      const val = await MembersAPI.updateMember(member);
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't update user!",
          contentMsg: val.error
        });
      } else {
        setSavedValues(getProfileValues(member));
        Emitters.generalSuccess.emit({
          headerMsg: 'Information Updated',
          contentMsg: 'Profile saved.'
        });
      }
    } catch {
      Emitters.userEditError.emit({
        headerMsg: "Couldn't update user!",
        contentMsg: 'Please try again. Your changes have been kept.'
      });
    } finally {
      saveInFlight.current = false;
      setSavingProfile(false);
    }
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
  const cropAndSubmitImage = async () => {
    if (!editor || !userInfo || savingPhoto) return;
    setSavingPhoto(true);
    try {
      const canvas = editor.getImage().toDataURL('image/jpeg');
      const blob = await fetch(canvas).then((res) => res.blob());
      await ImagesAPI.uploadImage(blob, `images/${userInfo.netid}`, { throwOnError: true });
      if (profilePhoto.startsWith('blob:')) window.URL.revokeObjectURL(profilePhoto);
      setProfilePhoto(window.URL.createObjectURL(blob));
      setOpen(false);
    } catch {
      Emitters.generalError.emit({
        headerMsg: "Couldn't update profile picture",
        contentMsg: 'Please try again. Your previous picture has been kept.'
      });
    } finally {
      setSavingPhoto(false);
    }
  };

  /**
   * Validates required profile fields and updates the member information.
   * Shows an error notification if required fields are empty.
   */
  const saveProfileInfo = () => {
    if (!hasProfileChanges || saveInFlight.current) return;

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

  return {
    userEmail,
    userInfoBeforeEdit,
    userRole,
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
    setProfilePhoto,
    setEditorRef,
    savingPhoto,
    hasProfileChanges,
    savingProfile,
    initialPronouns,
    cropAndSubmitImage,
    saveProfileInfo
  };
}
