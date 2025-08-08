import React from 'react';
import Image from 'next/image';
import SectionWrapper from './hoc/SectionWrapper';

type Icon = {
  src: string;
  link: string;
  alt: string;
};

const socialIcons: Icon[] = [
  {
    src: '/email.svg',
    link: 'mailto:hello@cornelldti.org',
    alt: 'Cornell DTI Email'
  },
  {
    src: '/github.svg',
    link: 'https://www.github.com/cornell-dti',
    alt: 'Cornell DTI Github'
  },
  {
    src: '/facebook.svg',
    link: 'https://www.facebook.com/cornelldti',
    alt: 'Cornell DTI Facebook'
  },
  {
    src: '/instagram.svg',
    link: 'https://www.instagram.com/cornelldti',
    alt: 'Cornell DTI Instagram'
  },
  {
    src: '/linkedin.svg',
    link: 'https://www.linkedin.com/company/cornelldti',
    alt: 'Cornell DTI LinkedIn'
  },
  {
    src: '/medium.svg',
    link: 'https://medium.com/cornelldti',
    alt: 'Cornell DTI Medium'
  }
];

type FooterProps = {
  theme: 'dark' | 'light';
};

const Footer: React.FC<FooterProps> = ({ theme }) => (
  <SectionWrapper id={'Website Footer'}>
    <div
      className={`${
        theme === 'dark' ? 'bg-black text-neutral-50' : 'bg-[#F5F5F5] text-[#0C0404]'
      } w-full h-[146px] flex justify-between items-center md:flex-row flex-col`}
    >
      <div
        className={`sm:w-[336px] sm:text-center md:text-base md:w-[310px] md:text-left lg:w-full text-xs font-medium flex flex-col items-center md:items-start gap-1 md:mb-0 mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-black'
        }`}
      >
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Cornell Digital Tech & Innovation Project Team
        </div>
        <div className="text-center md:text-left text-xs">
          This organization is a registered student organization of Cornell University.
        </div>
        <a
          href="https://hr.cornell.edu/about/workplace-rights/equal-education-and-employment"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xs hover:opacity-80 transition-opacity"
        >
          Equal Education and Employment
        </a>
      </div>

      <div className="flex gap-5 md:h-fit h-screen">
        {socialIcons.map((icon, index) => (
          <a
            key={index}
            href={icon.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 relative hover:opacity-60"
          >
            <Image
              className={`${theme === 'dark' ? 'invert-0' : 'invert'} w-full h-full`}
              src={icon.src}
              width={36}
              height={36}
              alt={icon.alt}
            />
          </a>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default Footer;
