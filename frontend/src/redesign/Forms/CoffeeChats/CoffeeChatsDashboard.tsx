import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { Button, Card, Link } from '../../../design-system-2026/components';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';
import CoffeeChatModal from './CoffeeChatDetailsModal';
import CoffeeChatsBingoBoard from './CoffeeChatsBingoBoard';

const CoffeeChatsDashboard = ({
  approvedChats,
  pendingChats,
  rejectedChats,
  archivedChats,
  isChatLoading,
  setPendingChats,
  setApprovedChats,
  bingoBoard,
  resetState,
  userInfo
}: {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  archivedChats: CoffeeChat[];
  isChatLoading: boolean;
  setPendingChats: Dispatch<SetStateAction<CoffeeChat[]>>;
  setApprovedChats: Dispatch<SetStateAction<CoffeeChat[]>>;
  bingoBoard: string[][];
  resetState: () => void;
  userInfo: IdolMember;
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<CoffeeChat | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [openRejected, setOpenRejected] = useState(false);
  const [openArchived, setOpenArchived] = useState(false);
  const [bingoCount, setBingoCount] = useState(0);

  const allChats = useMemo(
    () => [...approvedChats, ...pendingChats, ...rejectedChats],
    [approvedChats, pendingChats, rejectedChats]
  );

  const openChatModal = useCallback(
    (category: string) => {
      const chat = allChats
        .filter((chat) => chat.category === category)
        .sort((a, b) => b.date - a.date)[0];
      setSelectedChat(chat);
      setSelectedCategory(category);
      setOpen(true);
    },
    [allChats]
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

  const approvedArchivedChats = useMemo(
    () => archivedChats.filter((chat) => chat.status === 'approved' && chat.otherMember),
    [archivedChats]
  );

  const blackout = useMemo(
    () =>
      bingoBoard.flat().filter(Boolean).length > 0 &&
      bingoBoard
        .flat()
        .every((category) => approvedChats.some((chat) => chat.category === category)),
    [bingoBoard, approvedChats]
  );

  const deleteCoffeeChatRequest = async (chat: CoffeeChat) => {
    // Prevent accidentally clearing all coffee chats
    if (!chat.uuid) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to Delete Coffee Chat.',
        contentMsg:
          'Something went wrong, and the coffee chat was not deleted successfully. Please try again.'
      });
      return;
    }
    await CoffeeChatAPI.deleteCoffeeChat(chat.uuid)
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

  return (
    <>
      <header className={styles.header}>
        <h2 className="idol-heading-2">Check Coffee Chat Status</h2>
        <p>
          Track your coffee chat status for this semester! Accepted chats are marked in{' '}
          <strong className={styles.green}>green</strong>, rejected chats in{' '}
          <strong className={styles.red}>red</strong>, and pending chats in{' '}
          <strong className={styles.gray}>gray</strong>. Bingo rows, columns, or diagonals will be
          highlighted in <strong className={styles.yellow}>yellow</strong>.{' '}
          <strong>
            Click on a bingo cell to view more details, or view coffee chat suggestions.
          </strong>
        </p>
      </header>

      <div className={styles.container}>
        <strong>
          {blackout
            ? '🎉 Congratulations! You have achieved a blackout! 🎉'
            : `Bingo Count: ${bingoCount}`}
        </strong>
        <CoffeeChatsBingoBoard
          approvedChats={approvedChats}
          pendingChats={pendingChats}
          rejectedChats={rejectedChats}
          isChatLoading={isChatLoading}
          bingoBoard={bingoBoard}
          onCellClick={openChatModal}
          updateBingoCount={setBingoCount}
        />
      </div>

      <CoffeeChatModal
        coffeeChat={selectedChat}
        category={selectedCategory}
        open={open}
        setOpen={setOpen}
        deleteCoffeeChatRequest={deleteCoffeeChatRequest}
        userInfo={userInfo}
        submittedChats={[...pendingChats, ...approvedChats]}
        approvedArchivedChats={[...approvedArchivedChats]}
      />

      <div className={styles.rejected_section}>
        <Button
          variant="secondary"
          aria-expanded={openRejected}
          onClick={() => setOpenRejected((prev) => !prev)}
        >
          Show Previously Rejected Chats
        </Button>
        {openRejected &&
          (previouslyRejectedChats.length > 0 ? (
            <RejectedChatsDisplay coffeeChats={previouslyRejectedChats} />
          ) : (
            <div className={styles.rejected_display}>
              You don't have any previously rejected chats.
            </div>
          ))}
      </div>

      <br></br>

      <div className={styles.archived_chats_section}>
        <Button
          variant="secondary"
          aria-expanded={openArchived}
          onClick={() => setOpenArchived((prev) => !prev)}
        >
          Previous Coffee Chats
        </Button>
        {openArchived &&
          (approvedArchivedChats.length > 0 ? (
            <ArchivedChatsDisplay coffeeChats={approvedArchivedChats} />
          ) : (
            <div className={styles.archived_display}>You don't have any previous chats.</div>
          ))}
      </div>
    </>
  );
};

const ChatHistory = ({ coffeeChats }: { coffeeChats: CoffeeChat[] }) => (
  <div className={styles.historyCards}>
    {coffeeChats.map((chat) => (
      <Card
        key={chat.uuid}
        header={`${chat.otherMember.firstName} ${chat.otherMember.lastName} (${chat.otherMember.netid})`}
      >
        <p>Category: {chat.category}</p>
        {chat.reason && <p>Reason: {chat.reason}</p>}
        <Link href={chat.slackLink} target="_blank" rel="noopener noreferrer">
          Slack post
        </Link>
      </Card>
    ))}
  </div>
);
const RejectedChatsDisplay = ChatHistory;
const ArchivedChatsDisplay = ChatHistory;
export default CoffeeChatsDashboard;
