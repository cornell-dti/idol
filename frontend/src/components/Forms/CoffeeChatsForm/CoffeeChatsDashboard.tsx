import React, { Dispatch, SetStateAction } from 'react';
import { Card, Loader, Message, Button } from 'semantic-ui-react';
import styles from './CoffeeChatsForm.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';

const CoffeeChatsDashboard = (props: {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  isChatLoading: boolean;
  setPendingChats: Dispatch<SetStateAction<CoffeeChat[]>>;
}): JSX.Element => {
  const { approvedChats, pendingChats, rejectedChats, isChatLoading, setPendingChats } = props;

  const deleteCoffeeChatRequest = (coffeeChat: CoffeeChat) => {
    CoffeeChatAPI.deleteCoffeeChat(coffeeChat.uuid)
      .then(() => {
        setPendingChats(pendingChats.filter((currChat) => currChat.uuid !== coffeeChat.uuid));
        Emitters.generalSuccess.emit({
          headerMsg: 'Coffee Chat Deleted!',
          contentMsg: 'Your coffee chat was successfully deleted!'
        });
        Emitters.coffeeChatsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: 'You are not allowed to delete this coffee chat!',
          contentMsg: error
        });
      });
  };

  const CoffeeChatsDisplay = (props: { coffeeChatList: CoffeeChat[] }): JSX.Element => {
    const { coffeeChatList } = props;

    return (
      <Card.Group>
        {coffeeChatList.map((coffeeChat) => (
          <Card key={coffeeChat.uuid}>
            <Card.Content>
              <Card.Header>Coffee Chat with {coffeeChat.otherMember.firstName}</Card.Header>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px'
                }}
              >
                <div>
                  <Card.Meta>Category: {coffeeChat.slackLink}</Card.Meta>
                  <Card.Meta>
                    <b>
                      <a href={coffeeChat.slackLink}>Image Link</a>
                    </b>
                  </Card.Meta>
                </div>
                <Card.Meta>
                  {coffeeChat.status === 'pending' && (
                    <div>
                      <Button
                        basic
                        color="red"
                        floated="right"
                        size="small"
                        onClick={() => {
                          deleteCoffeeChatRequest(coffeeChat);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card.Meta>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    );
  };

  return (
    <div>
      <div className={styles.header}></div>
      <h1>Check Coffee Chats Status</h1>
      <p>Check your coffee chat status for this semester here!</p>

      {isChatLoading ? (
        <Loader active inline />
      ) : (
        <div>
          <div className={styles.inline}>
            <label className={styles.bold}>Approved Coffee Chat Submissions:</label>
            {approvedChats.length !== 0 ? (
              <CoffeeChatsDisplay coffeeChatList={approvedChats} />
            ) : (
              <Message>You have not been approved for any coffee chats yet.</Message>
            )}
          </div>

          <div className={styles.inline}>
            <label className={styles.bold}>Pending Approval For:</label>
            {pendingChats.length !== 0 ? (
              <CoffeeChatsDisplay coffeeChatList={pendingChats} />
            ) : (
              <Message>You are not currently pending approval for any coffee chats.</Message>
            )}
          </div>

          <div className={styles.inline}>
            <label className={styles.bold}>Rejected Events:</label>
            {rejectedChats.length !== 0 ? (
              <CoffeeChatsDisplay coffeeChatList={rejectedChats} />
            ) : (
              <Message>You have not been rejected for any coffee chats.</Message>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeChatsDashboard;
