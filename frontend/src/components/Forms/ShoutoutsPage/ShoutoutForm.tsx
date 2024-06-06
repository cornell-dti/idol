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

const mem1: IdolMember = {
  netid: 'ajt259',
  email: 'ajt259@cornell.edu',
  firstName: 'Andrea',
  lastName: 'Thia',
  pronouns: '',
  graduation: '',
  major: '',
  hometown: '',
  about: '',
  subteams: ['reviews'],
  role: 'designer',
  roleDescription: 'Designer'
};

const mem2: IdolMember = {
  netid: 'ajq22',
  email: 'ajq22@cornell.edu',
  firstName: 'Andrew',
  lastName: 'Qian',
  pronouns: 'he/him',
  graduation: '2027',
  major: 'Computer Science',
  hometown: 'Pennington, NJ',
  about: 'dev @ cureviews :)',
  subteams: ['reviews'],
  role: 'developer',
  roleDescription: 'Developer'
};
const mem3: IdolMember = {
  netid: 'bl628',
  email: 'bl628@cornell.edu',
  firstName: 'Brandon',
  lastName: 'Lee',
  pronouns: '',
  graduation: '',
  major: '',
  hometown: '',
  about: '',
  subteams: ['queuemein'],
  role: 'lead',
  roleDescription: 'Lead'
};

const mem4: IdolMember = {
  netid: 'az388',
  email: 'az388@cornell.edu',
  firstName: 'alyssa',
  lastName: 'zhang',
  pronouns: '',
  graduation: '',
  major: '',
  hometown: '',
  about: '',
  subteams: ['reviews'],
  role: 'developer',
  roleDescription: 'Developer'
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
    const coffeeChat: CoffeeChat = {
      uuid: '',
      members: [mem2, mem1],
      image: 'hallooo',
      category: 'cool',
      description: 'hehe',
      status: 'pending',
      date: Date.now()
    };
    ShoutoutsAPI.createCoffeeChat(coffeeChat)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'coffee chat created !',
          contentMsg: `:) `
        });
      })
      .catch((error) => {
        console.error('Error creating coffee chats:', error);
        Emitters.generalError.emit({
          headerMsg: 'Error creating',
          contentMsg: `An error occurred while creating coffee chats: ${error.message}`
        });
      });
  };

  const getMemChats = () => {
    ShoutoutsAPI.getCoffeeChatsByUser(mem4)
      .then((coffeeChats) => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Retrieve member coffee chats',
          contentMsg: `Successfully retrieved ${coffeeChats.length} coffee chats`
        });
      })
      .catch((error) => {
        console.error('Error retrieving member coffee chats:', error);
        Emitters.generalError.emit({
          headerMsg: 'Error retrieving coffee chats',
          contentMsg: `An error occurred while retrieving coffee chats: ${error.message}`
        });
      });
  };

  const getAllCoffee = () => {
    ShoutoutsAPI.getAllCoffeeChats()
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'get all coffee cahts',
          contentMsg: 'success'
        });
      })
      .catch((error) => {
        console.error('Error get all coffee chats:', error);
        Emitters.generalError.emit({
          headerMsg: 'Error get all coffee chats',
          contentMsg: `An error occurred while deleting all coffee chats: ${error.message}`
        });
      });
  };

  const deleteCoffeeChat = () => {
    ShoutoutsAPI.deleteCoffeeChat('305bfc59-d10a-4c2f-bddf-c7e790227197')
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Delete 1 coffee caht',
          contentMsg: 'hiii'
        });
      })
      .catch((error) => {
        console.error('Error retrieving member coffee chats:', error);
        Emitters.generalError.emit({
          headerMsg: 'Error deleting one coffee chats',
          contentMsg: `An error occurred while deleting 1 coffee chats: ${error.message}`
        });
      });
  };

  const deleteAll = () => {
    ShoutoutsAPI.clearAllCoffeeChats()
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Delete all coffee cahts',
          contentMsg: 'hiii'
        });
      })
      .catch((error) => {
        console.error('Error retrieving coffee chats:', error);
        Emitters.generalError.emit({
          headerMsg: 'Error deleting all coffee chats',
          contentMsg: `An error occurred while deleting all coffee chats: ${error.message}`
        });
      });
  };

  const updateCoffeeChat = () => {
    const coffeeChat: CoffeeChat = {
      uuid: '999d2799-3cfd-436f-93d4-71a51af9c17d',
      members: [mem2, mem3],
      image: 'IMG1',
      category: 'testing',
      description: 'change description',
      status: 'pending',
      date: Date.now()
    };
    const updatedCoffeeChat = {
      ...coffeeChat,
      status: 'approved' as Status
    };
    ShoutoutsAPI.updateCoffeeChat(updatedCoffeeChat)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'chat Approved!',
          contentMsg: 'The chat was successfully updated!'
        });
        Emitters.teamEventsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't update the chat!",
          contentMsg: error
        });
      });
  };

  return (
    <div>
      <Form className={styles.shoutoutForm}>
        <Form.Button floated="right" onClick={getAllCoffee}>
          get all coffee chats
        </Form.Button>
        <Form.Button floated="right" onClick={createCoffee}>
          create coffee chat
        </Form.Button>
        <Form.Button floated="right" onClick={getMemChats}>
          get coffee chat by user
        </Form.Button>
        <Form.Button floated="right" onClick={updateCoffeeChat}>
          update
        </Form.Button>
        <Form.Button floated="right" onClick={deleteCoffeeChat}>
          delete a coffee chat
        </Form.Button>
        <Form.Button floated="right" onClick={deleteAll}>
          delete all
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
