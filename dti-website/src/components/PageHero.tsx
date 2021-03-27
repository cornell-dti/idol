import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';
import NavBarPadding from './NavBarPadding';

type Props = {
  readonly className?: string;
  readonly bg?: string;
  readonly greyscale?: boolean;
  readonly style?: CSSProperties;
  readonly children: ReactNode;
};

export default function PageHero({
  className,
  bg = '',
  greyscale,
  style,
  children
}: Props): JSX.Element {
  return (
    <div
      className={clsx([
        'page-header',
        'page-hero',
        greyscale ? 'page-hero-greyscale' : '',
        className
      ])}
      style={{ background: bg, ...style }}
    >
      <NavBarPadding />
      {children}
    </div>
  );
}
