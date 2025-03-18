'use client';

import { ReactNode, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import useThemeContext from '../src/hooks/useThemeContext';

type PageProps = {
  children: ReactNode;
};

const Page = ({ children }: PageProps) => {
  const [footerTheme, setFooterTheme] = useState<'dark' | 'light'>('dark');
  const { ThemeContext } = useThemeContext();
  return (
    <>
      <ThemeContext.Provider value={{ setFooterTheme: (t) => setFooterTheme(t) }}>
        <Navbar />
        {children}
        <Footer theme={footerTheme} />
      </ThemeContext.Provider>
    </>
  );
};

export default Page;
