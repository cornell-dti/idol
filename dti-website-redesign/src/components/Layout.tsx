import React, { ReactNode } from 'react';
import Head from 'next/head';

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): JSX.Element => (
  <>
    <Head>
      <title>Cornell DTI</title>
    </Head>
    <div>{children}</div>
  </>
);

export default Layout;
