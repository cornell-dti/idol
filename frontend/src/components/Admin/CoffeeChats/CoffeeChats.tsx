import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createHash } from 'crypto';
import { Button } from 'semantic-ui-react';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { useMembers } from '../../Common/FirestoreDataProvider';
import CoffeeChatsBingoBoard from '../../Forms/CoffeeChatsForm/CoffeeChatsBingoBoard';

const CoffeeChats: React.FC = () => {
  const [bingoBoard, setBingoBoard] = useState<string[][]>([[]]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingChats, setPendingChats] = useState<CoffeeChat[]>([]);
  const [specificApprovedChats, setSpecificApprovedChats] = useState<CoffeeChat[]>([]);
  const [specificPendingChats, setSpecificPendingChats] = useState<CoffeeChat[]>([]);
  const [specificRejectedChats, setSpecificRejectedChats] = useState<CoffeeChat[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [displayMembers, setDisplayMembers] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<IdolMember | null>(null);

  const allMembers = useMembers();

  const chatCount = useMemo(
    () =>
      pendingChats.reduce((acc, chat) => {
        acc.set(chat.category, (acc.get(chat.category) ?? 0) + 1);
        return acc;
      }, new Map<string, number>()),
    [pendingChats]
  );

  const hashString = (category: string) => createHash('sha256').update(category).digest('hex');

  useEffect(() => {
    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => {
      setBingoBoard(board);
      setIsLoading(false);
    });
    CoffeeChatAPI.getAllCoffeeChats().then((coffeeChats) => {
      setPendingChats(coffeeChats.filter((chat) => chat.status === 'pending'));
    });
  }, [isLoading]);

  const handleMemberClick = (member: IdolMember) => {
    setIsChatLoading(true);
    setSelectedMember(member);

    CoffeeChatAPI.getCoffeeChatsByUser(member).then((coffeeChats) => {
      setSpecificApprovedChats(coffeeChats.filter((chat) => chat.status === 'approved'));
      setSpecificPendingChats(coffeeChats.filter((chat) => chat.status === 'pending'));
      setSpecificRejectedChats(coffeeChats.filter((chat) => chat.status === 'rejected'));
      setIsChatLoading(false);
    });

    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => setBingoBoard(board));
  };

  return (
    <div className={styles.flexContainer}>
      <div className="main-content">
        {selectedMember ? (
          <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
            <h2>
              Bingo Board for {selectedMember.firstName} {selectedMember.lastName}
            </h2>
            <CoffeeChatsBingoBoard
              approvedChats={specificApprovedChats}
              pendingChats={specificPendingChats}
              rejectedChats={specificRejectedChats}
              isChatLoading={isChatLoading}
              bingoBoard={bingoBoard}
            />
          </div>
        ) : (
          <div>
            <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
              <h1>Review Coffee Chats</h1>
            </div>
            <div className={styles.wrapper}>
              <div className={styles.bingo_board}>
                {bingoBoard.flat().map((category, index) => (
                  <div key={index}>
                    <Link
                      key={category}
                      href={{
                        pathname: `/admin/coffee-chat-details/${hashString(category)}`,
                        query: { category }
                      }}
                    >
                      <div className={styles.bingo_cell}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className={styles.bingo_text}>{category}</div>
                          <div className={styles.pending_text}>
                            {chatCount.get(category) ? `${chatCount.get(category)} pending` : ''}{' '}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={styles.buttonContainer}>
          <Link href="/admin/coffee-chats/dashboard">
            <Button>View Coffee Chats Dashboard</Button>
          </Link>
        </div>
      </div>
      <div className="dropdown-column">
        <div className={styles.dropdownContainer}>
          <button
            className={styles.dropdownButton}
            onClick={() => {
              if (selectedMember) {
                setSelectedMember(null);
              }
              setDisplayMembers(!displayMembers);
            }}
          >
            {!selectedMember ? "View Member Bingo Board" : "Review All Coffee Chats"}
          </button>
          {displayMembers && (
            <ul className={styles.dropdownMenu}>
              {allMembers.map((member, index) => (
                <li key={index}>
                  <button className={styles.memberButton} onClick={() => handleMemberClick(member)}>
                    {member.firstName} {member.lastName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeChats;
