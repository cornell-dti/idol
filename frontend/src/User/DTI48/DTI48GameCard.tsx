import { useEffect, useState } from 'react';
import { Button, Card } from 'semantic-ui-react';
import { DTI48PlaceholderSlot, DTI48ProfileImage } from './DTI48ProfileCard';
import { createBoard, step, getScore, gameStatus } from './game-board';
import styles from './DTI48GameCard.module.css';

type SlotProps = {
  readonly chain: readonly IdolMember[];
  readonly value: number;
};

function Slot({ chain, value }: SlotProps) {
  if (value === 0) {
    return <DTI48PlaceholderSlot type="empty" />;
  }
  if (value > chain.length) {
    return <DTI48PlaceholderSlot type="win" />;
  }
  const { netid, firstName, lastName } = chain[value - 1];
  return <DTI48ProfileImage netid={netid} name={`${firstName} ${lastName}`} />;
}

type Props = { readonly chain: readonly IdolMember[] };

export default function DTI48GameCard({ chain }: Props): JSX.Element {
  const maximumNumber = chain.length;
  const [board, setBoard] = useState(createBoard(3, maximumNumber));
  const score = getScore(board);
  const status = gameStatus(board);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'w':
          setBoard((b) => step(b, 'u'));
          break;
        case 'a':
          setBoard((b) => step(b, 'l'));
          break;
        case 's':
          setBoard((b) => step(b, 'd'));
          break;
        case 'd':
          setBoard((b) => step(b, 'r'));
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    window.addEventListener('keypress', handler);
    return () => window.removeEventListener('keypress', handler);
  }, []);

  return (
    <div className={styles.CardContainer}>
      <Card className={styles.Card}>
        <Card.Content>
          <Card.Header className={styles.MarginBottom}>
            Score: {score}
          </Card.Header>
          {status !== 'ongoing' ? (
            <Card.Header
              className={styles.MarginBottom}
              style={{ color: status === 'win' ? 'green' : 'red' }}
            >
              You {status}!
            </Card.Header>
          ) : (
            <Card.Header className={styles.MarginBottom}>
              Merge together two Ashneels to win!
            </Card.Header>
          )}
          <div className={styles.MarginBottom}>Use WASD to move around.</div>
          <div className={styles.Grid}>
            {board.board.map((value, index) => (
              <Slot key={index} chain={chain} value={value} />
            ))}
          </div>
          <div className={styles.Hide}>
            {chain.map((_, index) => (
              <Slot key={index} chain={chain} value={index + 1} />
            ))}
          </div>
        </Card.Content>
        <Card.Content extra>
          <div className="ui one buttons">
            <Button
              basic
              color="green"
              onClick={() => setBoard(createBoard(3, maximumNumber))}
            >
              Restart
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
