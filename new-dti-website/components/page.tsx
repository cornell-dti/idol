'use client';

import { ReactNode, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import useThemeContext from '../src/hooks/useThemeContext';
import Banner from './apply/Banner';

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
        <div className="relative">
          <Banner
            message={'Giving Day is today — click here to make a gift and support DTI!'}
            variant={'accent'}
            link={'https://givingday.cornell.edu/campaigns/cornell-digital-tech-innovation'}
          />
        </div>
        {children}
        <Footer theme={footerTheme} />
      </ThemeContext.Provider>
    </>
  );
};

export default Page;
