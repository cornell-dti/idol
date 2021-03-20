import React, { ReactNode } from 'react';
import Head from 'next/head';
import DtiMainMenu from './DtiMainMenu';
import DtiFooter from './DtiFooter';

type Props = {
  readonly className?: string;
  readonly title: string;
  readonly lightHeader?: boolean;
  readonly noFooter?: boolean;
  readonly hideSubfooter?: boolean;
  readonly children?: ReactNode;
};

const Layout = ({
  className,
  title,
  lightHeader,
  noFooter,
  hideSubfooter,
  children
}: Props): JSX.Element => (
  <>
    <Head>
      <title>{title} - Cornell DTI</title>
    </Head>
    <DtiMainMenu light={lightHeader} />
    <div className={className}>{children}</div>
    {!noFooter && <DtiFooter hideSubfooter={hideSubfooter} />}
  </>
);

export default Layout;
