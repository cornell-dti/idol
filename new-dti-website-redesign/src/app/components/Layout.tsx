'use client';

import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): ReactNode => (
  <>
    <Navbar />
    <main role="main" className="max-w-[1184px] mx-4 sm:mx-8 md:mx-32 lg:mx-auto">
      {children}
    </main>
  </>
);

export default Layout;
