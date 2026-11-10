import { useEffect, useState } from 'react';
import { Cube } from '@phosphor-icons/react/dist/csr/Cube';
import { SquaresFour } from '@phosphor-icons/react/dist/csr/SquaresFour';
import { Tabs } from '../../../design-system-2026/components';
import { getLinesFromBoard } from '../../../utils';
import CoffeeChatsBoard3D from './CoffeeChatsBoard3D';
import styles from './CoffeeChats.module.css';

interface CoffeeChatsBingoBoardProps {
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
  rejectedChats: CoffeeChat[];
  isChatLoading: boolean;
  bingoBoard: string[][];
  onCellClick?: (category: string) => void;
  updateBingoCount?: (count: number) => void;
}

export default function CoffeeChatsBingoBoard({
  approvedChats,
  pendingChats,
  rejectedChats,
  isChatLoading,
  bingoBoard,
  onCellClick,
  updateBingoCount
}: CoffeeChatsBingoBoardProps): JSX.Element {
  const [view, setView] = useState('normal');
  const categories = bingoBoard.flat().filter(Boolean);
  const lines = categories.length
    ? getLinesFromBoard(bingoBoard).filter(
        (line) =>
          line.length > 0 &&
          line.every((category) => approvedChats.some((chat) => chat.category === category))
      )
    : [];
  const all = [...approvedChats, ...pendingChats, ...rejectedChats].sort((a, b) => b.date - a.date);
  const blackout =
    categories.length > 0 &&
    categories.every((category) => approvedChats.some((chat) => chat.category === category));
  useEffect(() => updateBingoCount?.(lines.length), [lines.length, updateBingoCount]);
  if (isChatLoading) return <p role="status">Loading bingo board…</p>;
  if (!categories.length) return <p>No bingo categories are available yet.</p>;
  const columns = Math.max(...bingoBoard.map((row) => row.length));
  const cells = categories.map((category) => ({
    category,
    status: all.find((chat) => chat.category === category)?.status ?? ('default' as const),
    bingo: blackout || lines.some((line) => line.includes(category))
  }));
  const normalBoard = (
    <div className={styles.boardScroll}>
      <div
        className={styles.bingo_board}
        style={{
          gridTemplateColumns: `repeat(${columns},minmax(0,128px))`
        }}
      >
        {cells.map(({ category, status, bingo }, index) => (
          <button
            type="button"
            key={`${category}-${index}`}
            className={`${styles.cell} ${styles[bingo ? 'bingo' : status]}`}
            onClick={() => onCellClick?.(category)}
            aria-label={`${category}: ${status}${bingo ? ', bingo' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className={styles.boardViews}>
      <Tabs
        id="coffee-chat-board-view"
        label="Bingo board view"
        value={view}
        onValueChange={setView}
        items={[
          {
            value: 'normal',
            label: 'Normal',
            icon: <SquaresFour size={18} />,
            content: normalBoard
          },
          {
            value: '3d',
            label: '3D',
            icon: <Cube size={18} />,
            content: (
              <CoffeeChatsBoard3D cells={cells} columns={columns} onCellClick={onCellClick} />
            )
          }
        ]}
      />
    </div>
  );
}
