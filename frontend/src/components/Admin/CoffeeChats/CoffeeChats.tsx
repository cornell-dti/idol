import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { createHash } from 'crypto';
import { Button, Dropdown } from 'semantic-ui-react';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { useMembers } from '../../Common/FirestoreDataProvider';
import CoffeeChatsBingoBoard from '../../Forms/CoffeeChatsForm/CoffeeChatsBingoBoard';
import CoffeeChatCategoryEditModal from '../../Modals/CoffeeChatCategoryEditModal';
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
  const [categories, setCategories] = useState<CoffeeChatCategory[]>([]);
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

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
    CoffeeChatAPI.getCoffeeCategories().then(setCategories);
  }, [isLoading]);

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCSV(true);
    try {
      const csv = await file.text();
      await CoffeeChatAPI.uploadCoffeeChatCSV(csv);
      const [updated, board] = await Promise.all([
        CoffeeChatAPI.getCoffeeCategories(),
        CoffeeChatAPI.getCoffeeChatBingoBoard()
      ]);
      setCategories(updated);
      setBingoBoard(board);
      Emitters.generalSuccess.emit({
        headerMsg: 'Categories updated',
        contentMsg: 'Coffee chat categories have been updated from the CSV.'
      });
    } catch (error) {
      Emitters.generalError.emit({
        headerMsg: 'Upload failed',
        contentMsg: 'Could not parse or upload the CSV. Check the file format and try again.'
      });
    }
    setIsUploadingCSV(false);
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

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
          <div className={styles.buttonGroup}>
            <Button onClick={() => setSelectedMember(null)} disabled={selectedMember == null}>
              Review All Coffee Chats
            </Button>
            <Button onClick={archiveAllCoffeeChats} disabled={selectedMember !== null}>
              Archive All Coffee Chats
            </Button>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleCSVUpload}
            />
            <Button
              onClick={() => csvInputRef.current?.click()}
              loading={isUploadingCSV}
              disabled={isUploadingCSV}
            >
              Upload Categories CSV
            </Button>
          </div>
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
          <div className={styles.dropdownButton}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Edit Members in Category</p>
            {categories.map((cat) => (
              <div key={cat.index} className={styles.categoryRow}>
                <span>{cat.name}</span>
                <CoffeeChatCategoryEditModal
                  category={cat}
                  onSaved={(updated) =>
                    setCategories((prev) =>
                      prev.map((c) => (c.index === updated.index ? updated : c))
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeChats;
