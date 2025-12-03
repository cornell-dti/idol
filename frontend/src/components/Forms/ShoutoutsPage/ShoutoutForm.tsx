import React, { useRef, useState, useMemo } from 'react';
import { Form, TextArea, Checkbox, Loader } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { Emitters } from '../../../utils';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ImagesAPI from '../../../API/ImagesAPI';
import { useMembers } from '../../Common/FirestoreDataProvider';
import styles from './ShoutoutForm.module.css';

type ShoutoutFormProps = {
  getGivenShoutouts: () => void;
  getMentionShoutouts: () => void;
};

const ShoutoutForm: React.FC<ShoutoutFormProps> = ({ getGivenShoutouts, getMentionShoutouts }) => {
  const userEmail = useUserEmail();
  const members = useMembers();
  const user = members.find((it) => it.email === userEmail);
  const [recipientText, setRecipientText] = useState('');
  const [taggedMembers, setTaggedMembers] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredMembersForTags = useMemo(() => {
    if (!tagSearchQuery) return members;
    const query = tagSearchQuery.toLowerCase();
    return members.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`;
      const isAlreadyTagged = taggedMembers.includes(fullName);
      const matchesQuery =
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        fullName.toLowerCase().includes(query);
      return matchesQuery && !isAlreadyTagged;
    });
  }, [tagSearchQuery, members, taggedMembers]);

  const giveShoutout = async () => {
    setIsSubmitting(true);
    if (recipientText.trim() === '') {
      setIsSubmitting(false);
      Emitters.generalError.emit({
        headerMsg: 'No Recipient Specified',
        contentMsg: 'Please enter at least one recipient!'
      });
    } else if (message === '') {
      setIsSubmitting(false);
      Emitters.generalError.emit({
        headerMsg: 'No message submitted.',
        contentMsg: 'Please fill in a message!'
      });
    } else if (user) {
      let imageUrl = '';

      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        imageUrl = `shoutoutImages/${user.email}/${new Date().toISOString()}`;
        await ImagesAPI.uploadImage(blob, imageUrl);
      }

      const shoutout: Shoutout = {
        giver: user,
        receiver: recipientText,
        message,
        isAnon,
        timestamp: Date.now(),
        hidden: false,
        uuid: '',
        images: imageUrl ? [imageUrl] : [],
        tags: taggedMembers.length > 0 ? taggedMembers : undefined
      };

      ShoutoutsAPI.giveShoutout(shoutout).then((val) => {
        setIsSubmitting(false);
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't send shoutout!",
            contentMsg: val.error
          });
        } else {
          Emitters.generalSuccess.emit({
            headerMsg: 'Shoutout submitted!',
            contentMsg: `Thank you for recognizing ${recipientText}'s awesomeness! 🙏`
          });
          setRecipientText('');
          setTaggedMembers([]);
          setTagSearchQuery('');
          setMessage('');
          setIsAnon(true);
          setImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          getGivenShoutouts();
          getMentionShoutouts();
        }
      });
    }
  };

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
  };

  const removeTaggedMember = (name: string) => {
    setTaggedMembers(taggedMembers.filter((m) => m !== name));
  };

  return (
    <Form className={styles.shoutoutForm}>
      <h2 className={styles.formTitle}>Give someone a shoutout! 📣</h2>
      <div className={styles.formContainer}>
        <div style={{ flex: 1 }}>
          <Form.Input
            label="Who is awesome?"
            value={recipientText}
            onChange={(event) => setRecipientText(event.target.value)}
            placeholder="Type their name(s) here..."
            required
          />
        </div>
        <Checkbox
          label={{ children: 'Anonymous?' }}
          className={styles.isAnonCheckbox}
          checked={isAnon}
          onChange={() => setIsAnon(!isAnon)}
        />
      </div>

      <div style={{ position: 'relative', marginBottom: '1em', marginTop: '1em' }}>
        <Form.Input
          label="Tag people (optional)"
          value={tagSearchQuery}
          onChange={(event) => {
            setTagSearchQuery(event.target.value);
            setShowTagDropdown(true);
          }}
          onFocus={() => setShowTagDropdown(true)}
          placeholder="Search to tag members..."
        />
        {taggedMembers.length > 0 && (
          <div className={styles.selectedChips}>
            {taggedMembers.map((name) => (
              <div key={name} className={styles.chip}>
                {name}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => removeTaggedMember(name)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {showTagDropdown && tagSearchQuery && filteredMembersForTags.length > 0 && (
          <div className={styles.dropdown}>
            {filteredMembersForTags.map((member) => (
              <div
                key={member.email}
                className={styles.dropdownItem}
                onClick={() => {
                  setTaggedMembers([...taggedMembers, `${member.firstName} ${member.lastName}`]);
                  setTagSearchQuery('');
                  setShowTagDropdown(false);
                }}
              >
                {member.firstName} {member.lastName}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.reasonContainer}>
        <Form.Input
          label="Why are they awesome?"
          name="message"
          value={message}
          control={TextArea}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <div className={styles.imageUploadContainer}>
        <label className={styles.bold}>[Optional] Upload a picture with your shoutout here!</label>
        <input
          ref={fileInputRef}
          id="newImage"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleNewImage}
        />
      </div>

      <Form.Button
        floated="right"
        onClick={giveShoutout}
        disabled={isSubmitting}
        style={{ marginTop: '20px' }}
      >
        {isSubmitting ? <Loader active inline size="small" /> : 'Send'}
      </Form.Button>
    </Form>
  );
};

export default ShoutoutForm;
