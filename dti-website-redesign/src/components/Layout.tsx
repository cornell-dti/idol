import React, { ReactNode } from 'react';
import Head from 'next/head';

import Navbar from './Navbar';
import Footer from './Footer';

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): JSX.Element => (
  <>
    <Head>
      <title>Cornell DTI</title>
    </Head>
    <Navbar />
    <div>{children}</div>
    <Footer />
  </>
);

export default Layout;
