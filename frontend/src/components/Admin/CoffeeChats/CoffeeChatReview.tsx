import React, { useState } from 'react';
import { Button, Input, Icon } from 'semantic-ui-react';
import styles from './CoffeeChatReview.module.css';
import { Emitters } from '../../../utils';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';

const CoffeeChatReview = (props: {
  coffeeChat: CoffeeChat;
  currentStatus: Status;
}): JSX.Element => {
  const { coffeeChat, currentStatus } = props;
  const [reason, setReason] = useState('');

  const changeChatStatus = (status: Status) => {
    const updatedCoffeeChat = {
      ...coffeeChat,
      status,
      reason
    };
    CoffeeChatAPI.updateCoffeeChat(updatedCoffeeChat)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: `Coffee Chat ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
          contentMsg: `The coffee chat was successfully ${status}!`
        });
        Emitters.coffeeChatsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't update the coffee chat status!",
          contentMsg: error
        });
      });
  };

  if (currentStatus === 'approved') {
    return (
      <>
        <Input
          className={styles.rejectText}
          type="text"
          placeholder="Reason for reject"
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          basic
          color="red"
          disabled={reason === ''}
          onClick={() => {
            changeChatStatus('rejected');
          }}
        >
          Set to Rejected
        </Button>
      </>
    );
  }
  if (currentStatus === 'rejected') {
    return (
      <Button
        basic
        color="green"
        onClick={() => {
          changeChatStatus('approved');
        }}
      >
        Set to Approved
      </Button>
    );
  }
  return (
    <>
      <Input
        type="text"
        placeholder="Reason for reject"
        onChange={(e) => setReason(e.target.value)}
        style={{ marginRight: '10px', width: '155px' }}
      />
      <Button
        basic
        color="red"
        disabled={reason === ''}
        style={{ width: '20px', paddingLeft: '15px', paddingRight: '25px' }}
        onClick={() => {
          changeChatStatus('rejected');
        }}
      >
        <Icon name="close" />
      </Button>
      <Button
        basic
        color="green"
        disabled={reason !== ''}
        style={{ width: '20px', paddingLeft: '15px', paddingRight: '25px' }}
        onClick={() => {
          changeChatStatus('approved');
        }}
      >
        <Icon name="check" />
      </Button>
    </>
  );
};
export default CoffeeChatReview;
