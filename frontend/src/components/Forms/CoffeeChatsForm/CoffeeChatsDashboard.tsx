import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
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
  setApprovedChats,
  bingoBoard,
  resetState
}: {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  isChatLoading: boolean;
  setPendingChats: Dispatch<SetStateAction<CoffeeChat[]>>;
  setApprovedChats: Dispatch<SetStateAction<CoffeeChat[]>>;
  bingoBoard: string[][];
  resetState: () => void;
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<CoffeeChat | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [openRejected, setOpenRejected] = useState(false);
  const [bingoCount, setBingoCount] = useState(0);

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

  const isBingoCell = useMemo(() => {
    const map = new Map<string, boolean>();
    const size = bingoBoard.length;

    const isApprovedLine = (categories: string[]) =>
      categories.every((category) => approvedChats.some((chat) => chat.category === category));

    const linesToCheck = [
      ...bingoBoard, // Rows
      ...Array.from({ length: size }, (_, col) => bingoBoard.map((row) => row[col])), // Columns
      Array.from({ length: size }, (_, i) => bingoBoard[i][i]), // Primary diagonal
      Array.from({ length: size }, (_, i) => bingoBoard[i][size - 1 - i]) // Secondary diagonal
    ];

    let newBingoCount = 0;
    linesToCheck.forEach((line) => {
      if (isApprovedLine(line)) {
        newBingoCount += 1;
        line.forEach((category) => map.set(category, true));
      }
    });

    if (newBingoCount !== bingoCount) {
      setBingoCount(newBingoCount);
    }

    bingoBoard.flat().forEach((category) => {
      if (!map.has(category)) {
        map.set(category, false);
      }
    });

    return map;
  }, [bingoBoard, approvedChats, bingoCount]);

  const blackout = useMemo(
    () =>
      bingoBoard
        .flat()
        .every((category) => approvedChats.some((chat) => chat.category === category)),
    [bingoBoard, approvedChats]
  );

  const deleteCoffeeChatRequest = (chat: CoffeeChat) => {
    // Prevent accidentally clearing all coffee chats
    if (!chat.uuid) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to Delete Coffee Chat.',
        contentMsg:
          'Something went wrong, and the coffee chat was not deleted successfully. Please try again.'
      });
      return;
    }
    CoffeeChatAPI.deleteCoffeeChat(chat.uuid)
      .then(() => {
        setOpen(false);
        if (chat.status === 'pending') {
          setPendingChats((chats) => chats.filter((c) => c.uuid !== chat.uuid));
        }
        if (chat.status === 'approved') {
          setApprovedChats((chats) => chats.filter((c) => c.uuid !== chat.uuid));
        }
        Emitters.generalSuccess.emit({
          headerMsg: 'Coffee Chat Deleted!',
          contentMsg: 'Your coffee chat was successfully deleted!'
        });
        Emitters.coffeeChatsUpdated.emit();
        resetState();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: 'You are not allowed to delete this coffee chat!',
          contentMsg: error
        });
      });
  };

  const openChatModal = useCallback(
    (category: string) => {
      const chat = allChats.find((chat) => chat.category === category);
      setSelectedChat(chat);
      setSelectedCategory(category);
      setOpen(true);
    },
    [allChats]
  );

  const getAppearance = (category: string) => {
    if (blackout) return styles.blackout_display;
    if (isBingoCell.get(category)) return styles.bingo_display;
    return styles[categoryStatus.get(category)?.status || 'default'];
  };

  return (
    <>
      <header className={styles.header}>
        <h1>Check Coffee Chats Status</h1>
        <p>
          Track your coffee chat status for this semester! Accepted chats are marked in{' '}
          <strong style={{ color: '#02c002' }}>green</strong>, rejected chats in{' '}
          <strong style={{ color: '#f23e3e' }}>red</strong>, and pending chats in{' '}
          <strong style={{ color: '#7d7d7d' }}>gray</strong>. Bingo rows, columns, or diagonals will
          be highlighted in <strong style={{ color: '#d4af37' }}>yellow</strong>.{' '}
          <strong>
            Click on a bingo cell to view more details, or view coffee chat suggestions.
          </strong>
        </p>
        <strong>
          {blackout
            ? '🎉 Congratulations! You have achieved a blackout! 🎉'
            : `Bingo Count: ${bingoCount}`}
        </strong>
      </header>

      <div className={styles.container}>
        {isChatLoading ? (
          <Loader active inline />
        ) : (
          <div className={styles.bingo_board}>
            {bingoBoard.flat().map((category, index) => (
              <div key={index} className={getAppearance(category)}>
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
        category={selectedCategory}
        open={open}
        setOpen={setOpen}
        deleteCoffeeChatRequest={deleteCoffeeChatRequest}
        approvedChats={approvedChats}
        pendingChats={pendingChats}
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
                  Slack Link
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
