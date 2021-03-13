/* eslint-disable jsx-a11y/anchor-is-valid */

import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  readonly to: string;
  readonly className?: string;
  readonly children: ReactNode;
};

export default function NavItem({
  to,
  className,
  children
}: Props): JSX.Element {
  return (
    <li className={clsx('nav-item', className)}>
      <Link href={to} passHref prefetch>
        <a className="nav-link">{children}</a>
      </Link>
    </li>
  );
}
