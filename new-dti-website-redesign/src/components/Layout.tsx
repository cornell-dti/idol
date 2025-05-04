'use client';

import React, { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import DevNavbar from './DevNavbar';

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): ReactNode => {
  const [devMode, setdevMode] = useState(false);

  return (
    <>
      <Navbar enabled={devMode} setEnabled={setdevMode} />

      {devMode && <DevNavbar enabled={devMode} />}

      <main role="main" className="max-w-[1184px] mx-4 sm:mx-8 md:mx-32 lg:mx-auto">
        {children}
      </main>
    </>
  );
};

export default Layout;
