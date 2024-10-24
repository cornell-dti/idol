import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Icon, Loader, Table } from 'semantic-ui-react';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';
import CoffeeChatModal from '../../Modals/CoffeeChatDetailsModal';

const CoffeeChatsDashboard = ({
  approvedChats,
  pendingChats,
  rejectedChats,
  isChatLoading,
  setPendingChats,
  bingoBoard
}: {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  isChatLoading: boolean;
  setPendingChats: Dispatch<SetStateAction<CoffeeChat[]>>;
  bingoBoard: string[][];
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<CoffeeChat | undefined>(undefined);
  const [openRejected, setOpenRejected] = useState(false);

  const allChats = useMemo(
    () => [...approvedChats, ...pendingChats, ...rejectedChats],
    [approvedChats, pendingChats, rejectedChats]
  );

  const categoryStatus = useMemo(
    () =>
      allChats.reduce((acc, chat) => {
        if (!acc.get(chat.category) || chat.date > acc.get(chat.category)!.date) {
          acc.set(chat.category, chat);
        }
        return acc;
      }, new Map<string, CoffeeChat>()),
    [allChats]
  );

  const previouslyRejectedChats = useMemo(
    () => rejectedChats.filter((chat) => categoryStatus.get(chat.category)?.uuid !== chat.uuid),
    [categoryStatus, rejectedChats]
  );

  const deleteCoffeeChatRequest = (chat: CoffeeChat) => {
    CoffeeChatAPI.deleteCoffeeChat(chat.uuid)
      .then(() => {
        setOpen(false);
        setPendingChats((chats) => chats.filter((c) => c.uuid !== chat.uuid));
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

  const openChatModal = (category: string) => {
    const chat = allChats.find((chat) => chat.category === category);
    setSelectedChat(chat);
    setOpen(true);
  };

  return (
    <>
      <header className={styles.header}>
        <h1>Check Coffee Chats Status</h1>
        <p>
          Track your coffee chat status for this semester! Accepted chats are{' '}
          <strong style={{ color: '#02c002' }}>green</strong>, rejected are{' '}
          <strong style={{ color: '#f23e3e' }}>red</strong>, and pending are{' '}
          <strong style={{ color: '#7d7d7d' }}>gray</strong>. Click on a bingo cell to view more
          details.
        </p>
      </header>

      <div className={styles.container}>
        {isChatLoading ? (
          <Loader active inline />
        ) : (
          <div className={styles.bingo_board}>
            {bingoBoard.flat().map((category, index) => (
              <div
                key={index}
                className={styles[categoryStatus.get(category)?.status || 'default']}
              >
                <div className={styles.bingo_cell} onClick={() => openChatModal(category)}>
                  <div className={styles.bingo_text}>{category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CoffeeChatModal
        coffeeChat={selectedChat}
        open={open}
        setOpen={setOpen}
        deleteCoffeeChatRequest={deleteCoffeeChatRequest}
      />

      <div className={styles.rejected_section}>
        <Icon
          className={styles.btnContainer}
          name={openRejected ? 'angle down' : 'angle right'}
          onClick={() => setOpenRejected((prev) => !prev)}
        />
        <span className={styles.bold}>Show Previously Rejected Chats</span>
        {openRejected &&
          (previouslyRejectedChats.length > 0 ? (
            <RejectedChatsDisplay coffeeChats={previouslyRejectedChats} />
          ) : (
            <div className={styles.rejected_display}>
              You don't have any previously rejected chats.
            </div>
          ))}
      </div>
    </>
  );
};

const RejectedChatsDisplay = ({ coffeeChats }: { coffeeChats: CoffeeChat[] }) => (
  <div className={styles.rejected_display}>
    <Table celled style={{ border: '0.5px solid black' }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Chat Details</Table.HeaderCell>
          <Table.HeaderCell>Reject Reason</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {coffeeChats.map((chat) => (
          <Table.Row key={chat.uuid}>
            <Table.Cell>
              <div>
                Coffee Chat with {chat.otherMember.firstName} {chat.otherMember.lastName} (
                {chat.otherMember.netid})
              </div>
              <div>Category: {chat.category}</div>
              <div>
                <a href={chat.slackLink} target="_blank" rel="noopener noreferrer">
                  Image Link
                </a>
              </div>
            </Table.Cell>
            <Table.Cell>{chat.reason}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);

export default CoffeeChatsDashboard;
