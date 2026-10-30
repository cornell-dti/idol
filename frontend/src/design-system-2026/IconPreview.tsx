import { useState } from 'react';
import {
  HouseIcon,
  UsersIcon,
  CoffeeIcon,
  CalendarBlankIcon,
  ClipboardTextIcon,
  ChatCircleIcon,
  BellIcon,
  GearIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  IconWeight
} from './icons';
import styles from './TokenPreview.module.css';

const icons = [
  { name: 'House', Component: HouseIcon },
  { name: 'Users', Component: UsersIcon },
  { name: 'Coffee', Component: CoffeeIcon },
  { name: 'CalendarBlank', Component: CalendarBlankIcon },
  { name: 'ClipboardText', Component: ClipboardTextIcon },
  { name: 'ChatCircle', Component: ChatCircleIcon },
  { name: 'Bell', Component: BellIcon },
  { name: 'Gear', Component: GearIcon },
  { name: 'MagnifyingGlass', Component: MagnifyingGlassIcon },
  { name: 'Plus', Component: PlusIcon },
  { name: 'Check', Component: CheckIcon },
  { name: 'X', Component: XIcon }
];

const weights: IconWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

export default function IconPreview(): JSX.Element {
  const [weight, setWeight] = useState<IconWeight>('regular');
  const [size, setSize] = useState(24);
  const [color, setColor] = useState('fg-default');

  return (
    <section id="icons" className={styles.iconSection} aria-labelledby="icons-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>03 / Iconography</p>
          <h2 id="icons-title">Phosphor icons</h2>
          <p className={styles.description}>
            A starter set for IDOL, in six weights and both themes.
          </p>
        </div>
        <a
          className={styles.sourceLink}
          href="https://phosphoricons.com/"
          target="_blank"
          rel="noreferrer"
        >
          Browse Phosphor ↗
        </a>
      </div>
      <div className={styles.controls}>
        <label>
          Weight
          <select value={weight} onChange={(event) => setWeight(event.target.value as IconWeight)}>
            {weights.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Size
          <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
            {[16, 20, 24, 32].map((option) => (
              <option key={option} value={option}>
                {option} px
              </option>
            ))}
          </select>
        </label>
        <label>
          Color token
          <select value={color} onChange={(event) => setColor(event.target.value)}>
            <option value="fg-default">fg/default</option>
            <option value="fg-dimmer">fg/dimmer</option>
            <option value="accent-default">accent/default</option>
            <option value="danger-default">danger/default</option>
            <option value="success-default">success/default</option>
          </select>
        </label>
      </div>
      <div className={styles.themes}>
        {(['light', 'dark'] as const).map((mode) => (
          <section
            key={mode}
            data-idol-redesign
            data-idol-theme={mode}
            className={styles.panel}
            aria-label={`${mode} icons`}
          >
            <div className={styles.panelHeader}>
              <h3>{mode === 'light' ? 'Light' : 'Dark'}</h3>
              <span className={styles.modeBadge}>
                {weight} / {size} px
              </span>
            </div>
            <ul className={styles.iconGrid}>
              {icons.map(({ name, Component }) => (
                <li key={name} className={styles.iconTile}>
                  <span className={styles.iconGlyph} style={{ color: `var(--idol-${color})` }}>
                    <Component size={size} weight={weight} aria-hidden="true" focusable="false" />
                  </span>
                  <code>{name}</code>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
