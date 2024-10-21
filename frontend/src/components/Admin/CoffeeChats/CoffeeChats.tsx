import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createHash } from 'crypto';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';

const CoffeeChats: React.FC = () => {
  const [bingoBoard, setBingoBoard] = useState<string[][]>([[]]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const hashString = (category: string) => createHash('sha256').update(category).digest('hex');

  useEffect(() => {
    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => {
      setBingoBoard(board);
      setIsLoading(false);
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
              <div className={styles.bingo_cell}>
                <Link
                  key={category}
                  href={{
                    pathname: `/admin/coffee-chat-details/${hashString(category)}`,
                    query: { category }
                  }}
                >
                  <div className={styles.bingo_text}>{category}</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffeeChats;
