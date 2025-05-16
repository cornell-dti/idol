'use client';

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import DevNavbar from './DevNavbar';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props): React.ReactElement => (
  <>
    <Navbar />

    <DevNavbar />

    <main role="main" className="max-w-[1184px] mx-4 sm:mx-8 md:mx-32 lg:mx-auto">
      {children}
    </main>

    <Footer />
  </>
);

export default Layout;
