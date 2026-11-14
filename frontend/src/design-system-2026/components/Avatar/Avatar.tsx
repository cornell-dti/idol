import { useState } from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import styles from './Avatar.module.css';

export type AvatarProps = {
  name: string;
  size?: 32 | 64 | 96;
  src?: string;
  /** Image shown instead of initials when there is no `src` or it fails to load. */
  fallbackSrc?: string;
  decorative?: boolean;
  /** Show a skeleton instead of initials while the photo's URL is still being fetched. */
  loading?: boolean;
};
export function Avatar({
  name,
  size = 32,
  src,
  fallbackSrc,
  decorative = false,
  loading = false
}: AvatarProps): JSX.Element {
  // Which src finished loading (or failed), so a new src shows the skeleton again.
  const [settled, setSettled] = useState<string>();
  const pending = loading || Boolean(src && settled !== src);
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
      {src && (
        <BaseAvatar.Image
          src={src}
          alt=""
          width={size}
          height={size}
          onLoadingStatusChange={(status) => {
            if (status === 'loaded' || status === 'error') setSettled(src);
          }}
        />
      )}
      {pending ? (
        <span className={`${styles.skeleton} idol-skeleton`} aria-hidden="true" />
      ) : (
        <BaseAvatar.Fallback aria-hidden="true">
          {fallbackSrc ? <img src={fallbackSrc} alt="" width={size} height={size} /> : initials}
        </BaseAvatar.Fallback>
      )}
    </BaseAvatar.Root>
  );
}
