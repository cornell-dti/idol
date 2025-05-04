'use client';

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import DevNavbar from './DevNavbar';

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): JSX.Element => (
  <>
    <Navbar />

    <DevNavbar />

    <main role="main" className="max-w-[1184px] mx-4 sm:mx-8 md:mx-32 lg:mx-auto">
      {children}
    </main>
  </>
);

export default Layout;
