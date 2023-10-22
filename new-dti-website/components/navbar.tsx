'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dtiLogo from '../src/app/assets/images/dti_logo.svg';
import hamburgerMenuIcon from '../src/app/assets/icons/hamburger_icon.svg';
import closeMenuIcon from '../src/app/assets/icons/close_icon.svg';

interface NavbarProps {
  selectedPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ selectedPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="border border-red-500 w-full lg:p-12 md:p-6 inline-flex justify-between flex-row">
      <div className="border border-red-500 w-fit">
        <Image
          className="lg:w-72 md:w-60"
          src={dtiLogo.src}
          width={284}
          height={62}
          alt="DTI Logo"
        />
      </div>
      <div className="border border-red-500 md:hidden justify-self-end w-fit lg:inline-flex lg:flex-row gap-x-5 [&>*]:text-white [&>*]:lg:m-5 ">
        <a className="hover:underline" href="#">
          Team
        </a>
        <a className="hover:underline" href="#">
          Products
        </a>
        <a className="hover:underline" href="#">
          Courses
        </a>
        <a className="hover:underline" href="#">
          Initiative
        </a>
        <a className="hover:underline" href="#">
          Sponsor
        </a>
        <a className="hover:underline" href="#">
          Apply
        </a>
      </div>
      <div
        className="hidden border border-red-500 md:flex sm:flex w-fit"
        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
      >
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
  );
};

export default Navbar;
