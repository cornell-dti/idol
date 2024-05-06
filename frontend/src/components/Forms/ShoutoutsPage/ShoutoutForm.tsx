import React, { useState } from 'react';
import { Form, TextArea, Checkbox, Loader } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { Emitters } from '../../../utils';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
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

  const giveShoutout = () => {
    setIsSubmitting(true);
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
          getGivenShoutouts();
        }
      });
    }
  };

  const createCoffee = () => {
    const mem1: IdolMember = {
      netid: 'abc',
      email: 'abc@gmail.com',
      firstName: 'a',
      lastName: 'b',
      pronouns: 'she/her',
      graduation: '2024',
      major: 'cs',
      hometown: 'az',
      about: 'hello',
      subteams: ['Idol'],
      role: 'designer',
      roleDescription: 'Designer'
    };

    const mem2: IdolMember = {
      netid: 'xyz',
      email: 'xyz@gmail.com',
      firstName: 'x',
      lastName: 'z',
      pronouns: 'she/her',
      graduation: '2026',
      major: 'cs',
      hometown: 'az',
      about: 'hello',
      subteams: ['CU reviews'],
      role: 'designer',
      roleDescription: 'Designer'
    };

    const coffeeChat: CoffeeChat = {
      uuid: '',
      members: [mem1, mem2],
      image: 'hallooo',
      category: 'cool',
      description: 'hehe',
      status: 'pending',
      date: Date.now()
    };
    ShoutoutsAPI.createCoffeeChat(coffeeChat).then((val) => {
      Emitters.generalSuccess.emit({
        headerMsg: 'Shoutout submitted!',
        contentMsg: `Thank you for recognizing ${receiver}'s awesomeness! 🙏`
      });
    });
  };

  const getCoffee = () => {
    ShoutoutsAPI.getAllCoffeeChats().then((val) => {
      Emitters.generalSuccess.emit({
        headerMsg: 'Shoutout submitted!',
        contentMsg: `Thank you for recognizing ${receiver}'s awesomeness! 🙏`
      });
      console.log('hello');
    });
  };

  return (
    <div>
      <Form className={styles.shoutoutForm}>
        <Form.Button floated="right" onClick={createCoffee}>
          'testing'
        </Form.Button>
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

        <Form.Button floated="right" onClick={giveShoutout} disabled={isSubmitting}>
          {isSubmitting ? <Loader active inline size="small" /> : 'Send'}
        </Form.Button>
      </Form>
    </div>
  );
};

export default ShoutoutForm;
