import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createHash } from 'crypto';
import { Button, Dropdown } from 'semantic-ui-react';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { useMembers } from '../../Common/FirestoreDataProvider';
import CoffeeChatsBingoBoard from '../../Forms/CoffeeChatsForm/CoffeeChatsBingoBoard';
import { Emitters } from '../../../utils';

const CoffeeChats: React.FC = () => {
  const [bingoBoard, setBingoBoard] = useState<string[][]>([[]]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingChats, setPendingChats] = useState<CoffeeChat[]>([]);
  const [specificApprovedChats, setSpecificApprovedChats] = useState<CoffeeChat[]>([]);
  const [specificPendingChats, setSpecificPendingChats] = useState<CoffeeChat[]>([]);
  const [specificRejectedChats, setSpecificRejectedChats] = useState<CoffeeChat[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<IdolMember | null>(null);

  const DEAFAULT_MEMBER_DROPDOWN_TEXT: string = 'View Member Bingo Board';
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
      setPendingChats(coffeeChats.filter((chat) => !chat.isArchived && chat.status === 'pending'));
    });
  }, [isLoading]);

  const handleMemberClick = (member: IdolMember) => {
    setIsChatLoading(true);
    setSelectedMember(member);

    CoffeeChatAPI.getCoffeeChatsByUser(member).then((coffeeChats) => {
      const filteredChats = coffeeChats.filter((chat) => !chat.isArchived);
      setSpecificApprovedChats(filteredChats.filter((chat) => chat.status === 'approved'));
      setSpecificPendingChats(filteredChats.filter((chat) => chat.status === 'pending'));
      setSpecificRejectedChats(filteredChats.filter((chat) => chat.status === 'rejected'));
      setIsChatLoading(false);
    });

    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => setBingoBoard(board));
  };

  const memberOptions = allMembers.map((member) => ({
    key: member.netid,
    text: `${member.firstName} ${member.lastName} (${member.netid})`,
    value: member.netid
  }));

  const archiveAllCoffeeChats = async () => {
    if (
      !window.confirm(
        'Are you sure you want to archive all coffee chats? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await CoffeeChatAPI.archiveCoffeeChats();
      Emitters.generalSuccess.emit({
        headerMsg: 'Success',
        contentMsg: 'All coffee chats have been archived successfully!! :)'
      });
      setIsLoading(true);
    } catch (error) {
      Emitters.generalError.emit({
        headerMsg: 'Error',
        contentMsg: 'Failed to archive the coffee chats'
      });
    }
  };

  return (
    <div className={styles.flexContainer}>
      <div>
        {selectedMember ? (
          <div>
            <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
              <h1>
                Bingo Board for {selectedMember.firstName} {selectedMember.lastName}
              </h1>
            </div>
            <div className={styles.bingoBoardWrapper}>
              <CoffeeChatsBingoBoard
                approvedChats={specificApprovedChats}
                pendingChats={specificPendingChats}
                rejectedChats={specificRejectedChats}
                isChatLoading={isChatLoading}
                bingoBoard={bingoBoard}
              />
            </div>
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
      <div>
        <div className={styles.dropdownContainer}>
          <Button onClick={() => setSelectedMember(null)} disabled={selectedMember == null}>
            Review All Coffee Chats
          </Button>
          <Button onClick={archiveAllCoffeeChats} disabled={selectedMember !== null}>
            Archive All Coffee Chats
          </Button>
          <div className={styles.dropdownButton}>
            <Dropdown
              placeholder={DEAFAULT_MEMBER_DROPDOWN_TEXT}
              fluid
              selection
              value={selectedMember ? selectedMember.netid : DEAFAULT_MEMBER_DROPDOWN_TEXT}
              options={memberOptions}
              search
              onChange={(_, data) => {
                const selectedId = data.value as string | undefined;
                const selected = allMembers.find((member) => member.netid === selectedId) || null;
                setSelectedMember(selected);
                if (selected != null) handleMemberClick(selected);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeChats;
