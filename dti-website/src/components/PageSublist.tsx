import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = { borderPadding?: boolean; readonly children: ReactNode };

export default function PageSublist({
  borderPadding,
  children
}: Props): JSX.Element {
  return (
    <div
      className={clsx(
        'page-sublist',
        borderPadding ? '' : 'page-sublist-no-padding'
      )}
    >
      {children}
    </div>
  );
}
