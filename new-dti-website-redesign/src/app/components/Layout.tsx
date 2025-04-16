'use client';

import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): ReactNode => (
  <>
    <header role="banner">
      <Navbar />
    </header>
    <main role="main" className="min-h-screen p-6">
      {children}
    </main>
  </>
);

export default Layout;
