import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import styles from './Avatar.module.css';

export type AvatarProps = { name: string; size?: 32 | 96; src?: string; decorative?: boolean };
export function Avatar({ name, size = 32, src, decorative = false }: AvatarProps): JSX.Element {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '?';
  return (
    <BaseAvatar.Root
      className={`${styles.avatar} ${size === 96 ? styles.largeAvatar : ''}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
    >
      {src && <BaseAvatar.Image src={src} alt="" width={size} height={size} />}
      <BaseAvatar.Fallback aria-hidden="true">{initials}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
