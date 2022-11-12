import React, { useState } from 'react';
import { Form, TextArea, Checkbox } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { Emitters } from '../../../utils';
import { Shoutout, ShoutoutsAPI } from '../../../API/ShoutoutsAPI';
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

  const giveShoutout = () => {
    if (!receiver) {
      Emitters.generalError.emit({
        headerMsg: 'No Member Selected',
        contentMsg: 'Please select a member!'
      });
    } else if (user && receiver && message !== '') {
      const shoutout: Shoutout = {
        giver: user,
        receiver,
        message,
        isAnon,
        timestamp: Date.now(),
        hidden: false,
        uuid: ''
      };
      ShoutoutsAPI.giveShoutout(shoutout).then((val) => {
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
          setIsAnon(false);
          getGivenShoutouts();
        }
      });
    }
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
          defaultChecked
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

      <Form.Button floated="right" onClick={giveShoutout}>
        Send
      </Form.Button>
    </Form>
  );
};

export default ShoutoutForm;
