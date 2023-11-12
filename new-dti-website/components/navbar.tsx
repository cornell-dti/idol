'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const navbarItems = [
  {
    name: 'Team',
    url: '#'
  },
  {
    name: 'Products',
    url: '#'
  },
  {
    name: 'Courses',
    url: '#'
  },
  {
    name: 'Initiative',
    url: '#'
  },
  {
    name: 'Sponsor',
    url: '#'
  },
  {
    name: 'Apply',
    url: '#'
  }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div className="w-full px-5 py-7 md:p-10 lg:pl-11 lg:py-10 lg:pr-7 inline-flex justify-between flex-row">
        <div className="w-fit flex flex-col justify-center">
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
        <div className="hidden justify-self-end w-fit lg:inline-flex flex-row">
          {navbarItems.map((item) => (
            <a
              className="hover:underline cursor-pointer text-white p-4 underline-offset-8 decoration-2 decoration-white"
              href={item.url}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div
          className="flex lg:hidden w-fit"
          onClick={(e) => {
            document.body.classList.toggle('overflow-hidden');
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          {isMenuOpen ? (
            <Image
              className="h-12 w-auto md:h-14"
              src="/icons/close_icon.svg"
              width={56.5}
              height={56.5}
              alt="Close Menu Icon"
            />
          ) : (
            <Image
              className="h-12 w-auto md:h-14"
              src="/icons/hamburger_icon.svg"
              width={56.5}
              height={56.5}
              alt="Hamburger Menu Icom"
            />
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden absolute w-screen h-full">
          <div className="z-90 absolute w-screen h-full bg-stone-950 backdrop-filter backdrop-blur-lg bg-opacity-5 opacity-90 lg:hidden"></div>
          <div className="flex flex-row fixed w-screen h-screen justify-end">
            <div className="px-8 py-4 md:px-14 md:py-4 h-fit w-auto flex flex-col gap-y-6 landscape:gap-y-2 md:landscape:gap-y-6 text-right">
              {navbarItems.map((item) => (
                <a
                  className="hover:underline hover:transition-colors cursor-pointer text-white text-base md:text-2xl font-normal underline-offset-8 decoration-2 decoration-white"
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
  );
};

export default Navbar;
