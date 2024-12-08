import React, { useEffect, useMemo, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import styles from './CoffeeChats.module.css';
import { getLinesFromBoard } from '../../../utils';

interface CoffeeChatsBingoBoardProps {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  isChatLoading: boolean;
  bingoBoard: string[][];
  onCellClick?: (category: string) => void;
  updateBingoCount?: (count: number) => void;
}

const CoffeeChatsBingoBoard = ({
  approvedChats,
  pendingChats,
  rejectedChats,
  isChatLoading,
  bingoBoard,
  onCellClick,
  updateBingoCount
}: CoffeeChatsBingoBoardProps): JSX.Element => {
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

  const isBingoCell = useMemo(() => {
    const map = new Map<string, boolean>();

    const isApprovedLine = (categories: string[]) =>
      categories.every((category) => approvedChats.some((chat) => chat.category === category));

    const linesToCheck = getLinesFromBoard(bingoBoard);

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

  useEffect(() => {
    if (!updateBingoCount) return;
    updateBingoCount(bingoCount);
  }, [bingoCount, updateBingoCount]);

  const getAppearance = (category: string) => {
    if (blackout) return styles.blackout_display;
    if (isBingoCell.get(category)) return styles.bingo_display;
    return styles[categoryStatus.get(category)?.status || 'default'];
  };

  if (isChatLoading) {
    return <Loader active inline />;
  }

  return (
    <div className={styles.bingo_board}>
      {bingoBoard.flat().map((category, index) => (
        <div key={index} className={getAppearance(category)}>
          <div className={styles.bingo_cell} onClick={() => onCellClick?.(category)}>
            <div className={styles.bingo_text}>{category}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoffeeChatsBingoBoard;
