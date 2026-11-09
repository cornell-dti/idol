import { ReactNode } from 'react';
import { Avatar, Menu } from '../../design-system-2026/components';
import { CaretDownIcon } from '../../design-system-2026/icons';
import styles from './Navigation.module.css';

export default function ProfileMenu({
  name,
  src,
  children
}: {
  name: string;
  src?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Menu
      align="end"
      aria-label="Account menu"
      trigger={
        <button type="button" className={styles.profile} aria-label={`Profile: ${name}`}>
          <Avatar name={name} src={src} decorative />
          <span className={styles.profileLabel}>Profile</span>
          <CaretDownIcon size={14} aria-hidden />
        </button>
      }
    >
      {children}
    </Menu>
  );
}
