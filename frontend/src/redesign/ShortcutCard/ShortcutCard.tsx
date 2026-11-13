import Link from 'next/link';
import { Card } from '../../design-system-2026/components';
import type { Icon } from '../../design-system-2026/icons';
import styles from './ShortcutCard.module.css';

type Props = {
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly icon: Icon;
};

/** Linked card with an icon tile, shared by the homepage shortcuts and the Forms/Admin indexes. */
export default function ShortcutCard({
  href,
  label,
  description,
  icon: IconComponent
}: Props): JSX.Element {
  return (
    <Link href={href}>
      <a href={href} className={styles.link}>
        <Card className={styles.card}>
          <div className={styles.content}>
            <span className={styles.iconTile}>
              <IconComponent size={32} aria-hidden />
            </span>
            <div>
              <h3>{label}</h3>
              <p>{description}</p>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}
