'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dtiLogo from '../src/app/assets/images/dti_logo.svg';
import hamburgerMenuIcon from '../src/app/assets/icons/hamburger_icon.svg';
import closeMenuIcon from '../src/app/assets/icons/close_icon.svg';

// TODO: navbar page state changes
// TODO: responsive sizing
// TODO: remove red and todos when done
// TODO: hamburger menu animation
// TODO: image size transition lg-md? md-sm
interface NavbarProps {
  selectedPage: string;
}

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

const Navbar: React.FC<NavbarProps> = ({ selectedPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div className="w-full lg:p-12 md:p-6 sm:p-4 inline-flex justify-between flex-row">
        <div className="w-fit">
          <a href="#">
            <Image
              className="lg:w-72 md:w-60 sm:w-42"
              src={dtiLogo.src}
              width={284}
              height={62}
              alt="DTI Logo"
            />
          </a>
        </div>
        <div className="hidden justify-self-end w-fit lg:inline-flex lg:flex-row gap-x-1">
          {navbarItems.map((item) => (
            <a
              className="hover:underline text-white lg:m-5 underline-offset-8 decoration-2 decoration-red-500"
              href={item.url}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex lg:hidden w-fit" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <Image
              className="md:w-12"
              src={closeMenuIcon.src}
              width={56.5}
              height={56.5}
              alt="Close Menu Icon"
            />
          ) : (
            <Image
              className="md:w-12"
              src={hamburgerMenuIcon.src}
              width={56.5}
              height={56.5}
              alt="Hamburger Menu Icom"
            />
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div>
          <div className="z-90 fixed w-screen h-screen bg-stone-950 bg-blend-overlay blur-md opacity-75 lg:hidden"></div>
          <div className="flex flex-row fixed w-screen h-screen justify-end">
            <div className="z-0 m-5 p-4 flex flex-col gap-y-5 text-right">
              {navbarItems.map((item) => (
                <a
                  className="hover:underline text-white lg:m-5 text-2xl font-normal underline-offset-8 decoration-2 decoration-red-500"
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
