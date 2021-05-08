import React, { useContext, useState, useEffect } from 'react';
import { Form, TextArea, Segment, Label, Button } from 'semantic-ui-react';
import { UserContext } from '../../../UserProvider/UserProvider';
import CustomSearch from '../../../Common/Search/Search';
import Emitters from '../../../EventEmitter/constant-emitters';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { Shoutout, ShoutoutsAPI } from '../../../API/ShoutoutsAPI';

const ShoutoutForm: React.FC = () => {
  const userEmail = useContext(UserContext).user?.email;
  const [members, setMembers] = useState<IdolMember[] | undefined>(undefined);
  const [user, setUser] = useState<IdolMember | undefined>(undefined);
  const [recipient, setRecipient] = useState<IdolMember | undefined>(undefined);
  const [message, setMessage] = useState('');

  useEffect(() => {
    MembersAPI.getAllMembers()
      .then((mems) => {
        setMembers(mems);
      })
      .then(() => {
        if (userEmail) {
          MembersAPI.getMember(userEmail).then((mem) => setUser(mem));
        }
      });
  }, [userEmail]);

  const giveShoutout = () => {
    if (!recipient) {
      Emitters.generalError.emit({
        headerMsg: 'No Member Selected',
        contentMsg: 'Please select a member!'
      });
    } else if (recipient.email === userEmail) {
      Emitters.generalError.emit({
        headerMsg: 'No Self Shoutouts',
        contentMsg:
          "You can't give yourself a shoutout, please select a different member!"
      });
    } else if (user && recipient && message !== '') {
      const shoutout: Shoutout = {
        giver: user,
        receiver: recipient,
        message
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
        }
      });
    }
  };

  return (
    <Form
      style={{
        width: '100%',
        alignSelf: 'center',
        margin: 'auto'
      }}
    >
      <h2 style={{ marginBottom: '2vh' }}>Give someone a shoutout! 📣</h2>
      <label style={{ fontWeight: 'bold' }}>
        Who is awesome? <span style={{ color: '#db2828' }}>*</span>
      </label>

      {members && !recipient ? (
        <CustomSearch
          source={members}
          resultRenderer={(mem) => (
            <Segment>
              <h4>{`${mem.firstName} ${mem.lastName}`}</h4>
              <Label>{mem.email}</Label>
            </Segment>
          )}
          matchChecker={(query: string, member: Member) => {
            const queryLower = query.toLowerCase();
            return (
              member.email.toLowerCase().startsWith(queryLower) ||
              member.firstName.toLowerCase().startsWith(queryLower) ||
              member.lastName.toLowerCase().startsWith(queryLower) ||
              member.role.toLowerCase().startsWith(queryLower) ||
              `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}`.startsWith(
                queryLower
              )
            );
          }}
          selectCallback={(mem: Member) => {
            setRecipient(mem);
          }}
        ></CustomSearch>
      ) : undefined}

      {recipient ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline'
          }}
        >
          <p style={{ paddingRight: '1.5em' }}>
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

      <div style={{ padding: '0.8em 0' }}>
        <Form.Input
          label="Why are they awesome?"
          name="message"
          value={message}
          control={TextArea}
          onChange={(event) => setMessage(event.target.value)}
          style={{ minHeight: '25vh' }}
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
