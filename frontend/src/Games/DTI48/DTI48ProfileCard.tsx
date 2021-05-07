import { useState } from 'react';
import { Card } from 'semantic-ui-react';

import styles from './DTI48ProfileCard.module.css';

type Props = { readonly netid: string; readonly name: string };

export function DTI48PlaceholderSlot({
  type
}: {
  readonly type: 'win' | 'empty';
}): JSX.Element {
  return (
    <div
      className={`${styles.Placeholder} ${
        type === 'win' ? styles.Win : styles.Empty
      }`}
    />
  );
}

export function DTI48ProfileImage({ netid, name }: Props): JSX.Element {
  const [foundPic, setFoundPic] = useState(true);

  if (foundPic) {
    return (
      <img
        src={`https://www.cornelldti.org/static/members/${netid}.jpg`}
        className={styles.DTI48ProfileImage}
        onError={() => setFoundPic(false)}
        alt={name}
      />
    );
  }
  return <div className={`${styles.Placeholder} ${styles.Empty}`}>{name}</div>;
}

export default function DTI48ProfileCard({ netid, name }: Props): JSX.Element {
  return (
    <Card className={styles.DTI48ProfileCard}>
      <Card.Content>
        <Card.Header style={{ marginBottom: '1rem' }}>{name}</Card.Header>
        <DTI48ProfileImage netid={netid} name={name} />
      </Card.Content>
    </Card>
  );
}
