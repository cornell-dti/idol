'use client';

import React, { ReactNode } from 'react';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props): React.ReactElement => (
  <>
    <main role="main" id="main-content" className="relative">
      {children}
    </main>

    <Footer />
  </>
);

export default Layout;
