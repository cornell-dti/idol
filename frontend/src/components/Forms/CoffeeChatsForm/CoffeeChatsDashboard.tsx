import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import styles from './CoffeeChatsForm.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';
import { COFFEE_CHAT_BINGO_BOARD } from '../../../consts';
import CoffeeChatModal from '../../Modals/CoffeeChatDetailsModal';

const CoffeeChatsDashboard = (props: {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  isChatLoading: boolean;
  setPendingChats: Dispatch<SetStateAction<CoffeeChat[]>>;
}): JSX.Element => {
  const { approvedChats, pendingChats, rejectedChats, isChatLoading, setPendingChats } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<CoffeeChat | undefined>(undefined);
  const categoryStatus = useMemo(() => {
    const statusMap = new Map<string, CoffeeChat>();

    [...approvedChats, ...pendingChats, ...rejectedChats].forEach((chat) => {
      const existing: CoffeeChat | undefined = statusMap.get(chat.category);

      if (!existing || chat.date > existing.date) {
        statusMap.set(chat.category, chat);
      }
    });

    return statusMap;
  }, [approvedChats, pendingChats, rejectedChats]);

  const deleteCoffeeChatRequest = (coffeeChat: CoffeeChat) => {
    CoffeeChatAPI.deleteCoffeeChat(coffeeChat.uuid)
      .then(() => {
        setOpen(false);
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

  const getCoffeeChatByCategory = (category: string): CoffeeChat | undefined => {
    const findChat = (chatList: CoffeeChat[]) =>
      chatList.find((chat) => chat.category === category);

    return findChat(approvedChats) || findChat(pendingChats) || findChat(rejectedChats);
  };

  const openChatModal = (category: string) => {
    const chat = getCoffeeChatByCategory(category);
    setSelectedChat(chat);
    setOpen(true);
  };

  return (
    <>
      <div className={styles.coffee_chat_header}>
        <h1>Check Coffee Chats Status</h1>
        <p>
          Track your coffee chat status for this semester here! Accepted chats are highlighted in{' '}
          <strong style={{ color: '#02c002' }}>green</strong>, rejected ones appear in{' '}
          <strong style={{ color: '#f23e3e' }}>red</strong>, and pending ones appear in{' '}
          <strong style={{ color: '#7d7d7d' }}>gray</strong>. Click on a bingo cell to view more
          details about each chat.
        </p>
      </div>

      <div className={styles.container}>
        {isChatLoading ? (
          <Loader active inline />
        ) : (
          <div className={styles.bingo_board}>
            {COFFEE_CHAT_BINGO_BOARD.flat().map((category, index) => {
              const status = categoryStatus.get(category)?.status || 'default';

              return (
                <>
                  <div key={index} className={styles[status]}>
                    <div className={styles.bingo_cell} onClick={() => openChatModal(category)}>
                      <div className={styles.bingo_text}>{category}</div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
      <CoffeeChatModal
        coffeeChat={selectedChat}
        open={open}
        setOpen={setOpen}
        deleteCoffeeChatRequest={deleteCoffeeChatRequest}
      />
    </>
  );
};

export default CoffeeChatsDashboard;
