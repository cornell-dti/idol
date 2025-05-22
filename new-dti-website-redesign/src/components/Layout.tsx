'use client';

import React, { ReactNode } from 'react';
import DevNavbar from './DevNavbar';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props): React.ReactElement => (
  <>
    <DevNavbar />

    <main role="main">{children}</main>

    <Footer />
  </>
);

export default Layout;
