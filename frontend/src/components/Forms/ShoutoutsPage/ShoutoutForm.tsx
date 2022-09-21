import React, { useState } from 'react';
import { Form, TextArea, Button, Checkbox } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { MemberSearch } from '../../Common/Search/Search';
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
  const [recipient, setRecipient] = useState<IdolMember | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isAnon, setIsAnon] = useState(false);

  const giveShoutout = () => {
    if (!recipient) {
      Emitters.generalError.emit({
        headerMsg: 'No Member Selected',
        contentMsg: 'Please select a member!'
      });
    } else if (recipient.email === userEmail) {
      Emitters.generalError.emit({
        headerMsg: 'No Self Shoutouts',
        contentMsg: "You can't give yourself a shoutout, please select a different member!"
      });
    } else if (user && recipient && message !== '') {
      const shoutout: Shoutout = {
        giver: user,
        receiver: recipient,
        message,
        isAnon
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
            contentMsg: `Thank you for recognizing ${recipient.firstName}'s awesomeness! 🙏`
          });
          setRecipient(undefined);
          setMessage('');
          getGivenShoutouts();
        }
      });
    }
  };

  return (
    <Form className={styles.shoutoutForm}>
      <h2 className={styles.formTitle}>Give someone a shoutout! 📣</h2>
      <label className={styles.formLabel}>
        Who is awesome? <span style={{ color: '#db2828' }}>*</span>
      </label>

      <div className={styles.formContainer}>
        {!recipient ? <MemberSearch onSelect={setRecipient} /> : undefined}

        {recipient ? (
          <div className={styles.recipientNameDisplayContainer}>
            <p className={styles.recipientNameDisplay}>
              {recipient?.firstName} {recipient?.lastName}
            </p>
            <Button
              negative
              onClick={() => {
                setRecipient(undefined);
              }}
            >
              Clear
            </Button>
          </div>
        ) : undefined}

        <Checkbox
          label={{ children: 'Anonymous?' }}
          className={styles.isAnonCheckbox}
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

      <Form.Button floated="right" onClick={giveShoutout} style={{ marginBottom: 0 }}>
        Send
      </Form.Button>
    </Form>
  );
};

export default ShoutoutForm;
