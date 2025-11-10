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
};

const ShoutoutForm: React.FC<ShoutoutFormProps> = ({ getGivenShoutouts }) => {
  const userEmail = useUserEmail();
  const members = useMembers();
  const user = members.find((it) => it.email === userEmail);
  const [receiver, setReceiver] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(query)
    );
  }, [searchQuery, members]);

  const giveShoutout = async () => {
    setIsSubmitting(true);
    if (!receiver) {
      setIsSubmitting(false);
      Emitters.generalError.emit({
        headerMsg: 'No Member Selected',
        contentMsg: "Please fill in a member's name!"
      });
    } else if (message === '') {
      setIsSubmitting(false);
      Emitters.generalError.emit({
        headerMsg: 'No message submitted.',
        contentMsg: 'Please fill in a message!'
      });
    } else if (user && receiver) {
      let imageUrl = '';

      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        imageUrl = `shoutoutImages/${user.email}/${new Date().toISOString()}`;
        await ImagesAPI.uploadImage(blob, imageUrl);
      }

      const shoutout: Shoutout = {
        giver: user,
        receiver,
        message,
        isAnon,
        timestamp: Date.now(),
        hidden: false,
        uuid: '',
        images: imageUrl ? [imageUrl] : []
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
            contentMsg: `Thank you for recognizing ${receiver}'s awesomeness! 🙏`
          });
          setReceiver('');
          setSearchQuery('');
          setMessage('');
          setIsAnon(true);
          setImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          getGivenShoutouts();
        }
      });
    }
  };

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    setImage(newImage);
  };

  return (
    <Form className={styles.shoutoutForm}>
      <h2 className={styles.formTitle}>Give someone a shoutout! 📣</h2>
      <div className={styles.formContainer}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Form.Input
            label="Who is awesome?"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={receiver || 'Type away to search...'}
            required
          />
          {showDropdown && searchQuery && filteredMembers.length > 0 && (
            <div className={styles.dropdown}>
              {filteredMembers.map((member) => (
                <div
                  key={member.email}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setReceiver(`${member.firstName} ${member.lastName}`);
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                >
                  {member.firstName} {member.lastName}
                </div>
              ))}
            </div>
          )}
        </div>
        <Checkbox
          label={{ children: 'Anonymous?' }}
          className={styles.isAnonCheckbox}
          checked={isAnon}
          onChange={() => setIsAnon(!isAnon)}
        />
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
