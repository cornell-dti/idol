'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import Chip from './Chip';
import MailIcon from './icons/MailIcon';
import GitHubIcon from './icons/GitHubIcon';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import ArrowLogoIcon from './icons/ArrowLogoIcon';

export default function Footer() {
  const DTILinks = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/products', label: 'Products' },
    { href: '/course', label: 'Course' },
    { href: '/initiatives', label: 'Initiatives' },
    { href: '/sponsor', label: 'Sponsor' },
    { href: '/apply', label: 'Apply' },
    { href: '/design-system', label: 'Design system' }
  ];

  const ProductLinks = [
    { href: 'https://www.cureviews.org/', label: 'CU Reviews' },
    { href: 'https://courseplan.io/', label: 'Course Plan' },
    { href: 'https://queueme.in/', label: 'Queue Me In' },
    { href: 'https://www.cudesign.io/', label: 'Design @ Cornell' },
    { href: 'https://zing-lsc-prod.web.app/', label: 'Zing' },
    { href: 'https://cuapts.org/', label: 'CU Apts' },
    { href: '/products#carriage', label: 'Carriage' },
    { href: '/products#cornellgo', label: 'Cornell Go' }
  ];

  const SocialLinks = [
    {
      href: 'mailto:hello@cornelldti.org',
      label: 'Cornell DTI Email',
      icon: <MailIcon />
    },
    {
      href: 'https://www.github.com/cornell-dti',
      label: 'Cornell DTI Github',
      icon: <GitHubIcon />
    },
    {
      href: 'https://www.facebook.com/cornelldti',
      label: 'Cornell DTI Facebook',
      icon: <FacebookIcon />
    },
    {
      href: 'https://www.instagram.com/cornelldti',
      label: 'Cornell DTI Instagram',
      icon: <InstagramIcon />
    },
    {
      href: 'https://www.linkedin.com/company/cornelldti',
      label: 'Cornell DTI LinkedIn',
      icon: <LinkedInIcon />
    }
  ];

  const DTILinksSection = () => (
    <div className="flex flex-col gap-2">
      <h6 className="text-foreground-1">Cornell DTI</h6>
      <ul className="flex flex-col gap-1 list-none">
        {DTILinks.map(({ href, label }) => (
          <li key={href} className="flex gap-2 items-center">
            <Link
              href={href}
              className="text-foreground-3 hover:text-foreground-1 font-medium rounded-sm focusState transition-[color] duration-[120ms] whitespace-nowrap"
            >
              {label}
            </Link>

            {label === 'Design system' && <Chip label="beta" allCaps />}
          </li>
        ))}
      </ul>
    </div>
  );

  const ProductLinksSection = () => (
    <div className="flex flex-col gap-2">
      <h6 className="text-foreground-1">Products</h6>
      <ul className="flex flex-col gap-1 list-none">
        {ProductLinks.map(({ href, label }) => (
          <li key={label}>
            {href ? (
              <Link
                href={href}
                target="_blank"
                className="text-foreground-3 hover:text-foreground-1 font-medium rounded-sm focusState transition-[color] duration-[120ms]"
              >
                {label}
              </Link>
            ) : (
              <span className="text-foreground-3 cursor-default font-medium">{label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const DTILogoSection = () => (
    <div>
      <Link
        href={'/'}
        className="inline-flex rounded-sm focusState activeState interactive"
        aria-label="Go to homepage"
      >
        {
          <Image
            src="/wordmark.svg"
            alt="Cornell Digital Tech & Innovation logo"
            width={269}
            height={48}
          />
        }
      </Link>

      <ul className="flex max-w-[220px] justify-between list-none pt-4">
        {SocialLinks.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-foreground-3 hover:text-foreground-1 inline-flex rounded-sm focusState activeState interactive"
              aria-label={label}
              target="_blank"
            >
              {icon}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer
      className="max-w-[1184px] mx-auto sm:rounded-t-2xl bg-[linear-gradient(to_bottom,#121212,#0D0D0D)] !mt-px
    relative before:content-[''] before:absolute before:-top-px before:-left-px before:w-[calc(100%+2px)] before:h-[calc(100%+1px)] before:z-[-2] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] before:sm:rounded-t-2xl flex flex-col gap-2"
    >
      <div className="flex flex-col min-[1000px]:flex-row ">
        <div className="w-full sm:w-3/4 min-[1000px]:w-1/4 p-4 sm:p-8">
          <DTILogoSection />
        </div>

        <div className="flex min-[1000px]:w-1/2 max-[480px]:flex-col">
          <div className="flex-1 p-4 sm:p-8">
            <DTILinksSection />
          </div>

          <div className="flex-1 p-4 sm:p-8">
            <ProductLinksSection />
          </div>
        </div>

        <div className="w-1/4 min-[1000px]:p-8 flex justify-end max-[1000px]:absolute sm:top-8 sm:right-8 right-4 bottom-4">
          <Button
            label="Back to top"
            variant="secondary"
            backToTop={<ArrowLogoIcon width={20} height={20} />}
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8 p-4 sm:p-8 pt-0">
        <div className="w-full h-px bg-border-1" />

        <div className="sm:flex-row flex-col flex sm:gap-0 gap-4 justify-between">
          <p className="!text-sm text-foreground-3">
            This organization is a registered student organization of Cornell University.
          </p>
          <p className="!text-sm text-foreground-3">&copy; 2025 Cornell DTI</p>
        </div>
      </div>
    </footer>
  );
}
