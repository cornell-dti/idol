'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SectionWrapper from './hoc/SectionWrapper';

const navbarItems = [
  {
    name: 'Team',
    url: '/team'
  },
  {
    name: 'Products',
    url: '/products'
  },
  {
    name: 'Course',
    url: '/course'
  },
  {
    name: 'Initiatives',
    url: '/initiatives'
  },
  {
    name: 'Sponsor',
    url: '/sponsor'
  },
  {
    name: 'Apply',
    url: '/apply'
  }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleMenuClick = () => {
    document.body.classList.toggle('overflow-hidden');
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <SectionWrapper id={'Website Navbar'}>
      <div className="relative z-[60]">
        <div className="w-full !inline-flex !justify-between !flex-row">
          <div className="w-fit flex flex-col !justify-center z-40">
            <a href="/">
              <Image
                className="md:h-12 h-8 w-auto"
                src="/dti_logo.svg"
                width={280}
                height={62}
                alt="DTI Logo"
              />
            </a>
          </div>
          <div className="hidden !justify-self-end w-fit lg:inline-flex flex-row">
            {navbarItems.map((item) => (
              <a
                className={`hover:underline cursor-pointer text-white p-4 underline-offset-8 decoration-2 decoration-white h-[48px] flex items-center ${
                  pathname === item.url ? 'underline' : ''
                }`}
                href={item.url}
                key={item.name}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className={`flex lg:hidden w-fit ${isMenuOpen ? 'z-50' : 'z-10'}`}>
            {!isMenuOpen ? (
              <button onClick={handleMenuClick} aria-label="Open navigation menu">
                <Image
                  className="h-12 w-auto md:h-14"
                  src="/icons/hamburger_icon.svg"
                  width={56.5}
                  height={56.5}
                  alt=""
                />
              </button>
            ) : (
              <div className="h-12 w-auto md:h-14" />
            )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 lg:hidden">
            <div className="w-full h-full">
              <div className="w-full p-6 md:p-10 flex flex-col items-end">
                <button onClick={handleMenuClick} aria-label="Close Menu Icon">
                  <Image
                    className="h-12 w-auto md:h-14"
                    src="/icons/close_icon.svg"
                    width={56.5}
                    height={56.5}
                    alt=""
                  />
                </button>
              </div>
              <div className="backdrop-blur-sm w-full px-8 py-4 md:px-14 md:py-4 h-full flex flex-col gap-y-6 landscape:gap-y-2 md:landscape:gap-y-6 text-right">
                {navbarItems.map((item) => (
                  <a
                    key={item.name}
                    className="hover:underline cursor-pointer text-white text-base md:text-2xl font-normal underline-offset-8 decoration-2 decoration-white"
                    href={item.url}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Navbar;
