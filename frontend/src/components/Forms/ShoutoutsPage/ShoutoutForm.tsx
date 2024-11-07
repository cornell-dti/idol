import React, { useRef, useState } from 'react';
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
  const [message, setMessage] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const giveShoutout = async () => {
    setIsSubmitting(true);
    if (!receiver) {
      Emitters.generalError.emit({
        headerMsg: 'No Member Selected',
        contentMsg: 'Please select a member!'
      });
    } else if (user && receiver && message !== '') {
      let imageUrl = '';

      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        imageUrl = `shoutoutProofs/${user.email}/${new Date().toISOString()}`;
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
        <Form.Input
          label="Who is awesome?"
          value={receiver}
          onChange={(event) => setReceiver(event.target.value)}
          required
        />
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
        <label className={styles.bold}>Upload a picture with your shoutout here!</label>
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
