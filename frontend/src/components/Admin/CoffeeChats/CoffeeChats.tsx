import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createHash } from 'crypto';
import { Button } from 'semantic-ui-react';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';

const CoffeeChats: React.FC = () => {
  const [bingoBoard, setBingoBoard] = useState<string[][]>([[]]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingChats, setPendingChats] = useState<CoffeeChat[]>([]);
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

  return (
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
      <div className={styles.buttonContainer}>
        <Link href="/admin/coffee-chats/dashboard">
          <Button>View Coffee Chats Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default CoffeeChats;
