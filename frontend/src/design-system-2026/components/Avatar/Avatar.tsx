import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import styles from './Avatar.module.css';

export type AvatarProps = {
  name: string;
  size?: 32 | 64 | 96;
  src?: string;
  /** Image shown instead of initials when there is no `src` or it fails to load. */
  fallbackSrc?: string;
  decorative?: boolean;
};
export function Avatar({
  name,
  size = 32,
  src,
  fallbackSrc,
  decorative = false
}: AvatarProps): JSX.Element {
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
      className={`${styles.avatar} ${size === 96 ? styles.largeAvatar : ''} ${
        size === 64 ? styles.mediumAvatar : ''
      }`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
    >
      {src && <BaseAvatar.Image src={src} alt="" width={size} height={size} />}
      {/* The delay keeps the fallback from flashing while a photo loads. */}
      <BaseAvatar.Fallback aria-hidden="true" delay={src ? 600 : undefined}>
        {fallbackSrc ? <img src={fallbackSrc} alt="" width={size} height={size} /> : initials}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
