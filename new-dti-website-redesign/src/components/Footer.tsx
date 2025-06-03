'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import Chip from './Chip';

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
    { href: '', label: 'Carriage' },
    { href: '', label: 'Cornell Go' }
  ];

  const SocialLinks = [
    {
      href: 'mailto:hello@cornelldti.org',
      label: 'Cornell DTI Email',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-mail-icon lucide-mail"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    },
    {
      href: 'https://www.github.com/cornell-dti',
      label: 'Cornell DTI Github',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="stroke-current"
        >
          <path
            d="M12 1.5C6.20156 1.5 1.5 6.32344 1.5 12.2672C1.5 17.025 4.50937 21.0562 8.68125 22.4812C8.73977 22.494 8.79949 22.5002 8.85938 22.5C9.24844 22.5 9.39844 22.2141 9.39844 21.9656C9.39844 21.7078 9.38906 21.0328 9.38437 20.1328C9.03705 20.2142 8.68173 20.2567 8.325 20.2594C6.30469 20.2594 5.84531 18.6891 5.84531 18.6891C5.36719 17.4469 4.67813 17.1141 4.67813 17.1141C3.76406 16.4719 4.67344 16.4531 4.74375 16.4531H4.74844C5.80313 16.5469 6.35625 17.5687 6.35625 17.5687C6.88125 18.4875 7.58437 18.7453 8.2125 18.7453C8.62783 18.737 9.03673 18.6412 9.4125 18.4641C9.50625 17.7703 9.77812 17.2969 10.0781 17.025C7.74844 16.7531 5.29688 15.8297 5.29688 11.7047C5.29688 10.5281 5.70469 9.56719 6.375 8.81719C6.26719 8.54531 5.90625 7.44844 6.47812 5.96719C6.55483 5.94883 6.63368 5.94095 6.7125 5.94375C7.09219 5.94375 7.95 6.08906 9.36563 7.07344C11.0857 6.59218 12.9049 6.59218 14.625 7.07344C16.0406 6.08906 16.8984 5.94375 17.2781 5.94375C17.3569 5.94095 17.4358 5.94883 17.5125 5.96719C18.0844 7.44844 17.7234 8.54531 17.6156 8.81719C18.2859 9.57187 18.6937 10.5328 18.6937 11.7047C18.6937 15.8391 16.2375 16.7484 13.8984 17.0156C14.2734 17.3484 14.6109 18.0047 14.6109 19.0078C14.6109 20.4469 14.5969 21.6094 14.5969 21.9609C14.5969 22.2141 14.7422 22.5 15.1312 22.5C15.1942 22.5003 15.2571 22.494 15.3187 22.4812C19.4953 21.0562 22.5 17.0203 22.5 12.2672C22.5 6.32344 17.7984 1.5 12 1.5Z"
            fill="currentColor"
          />
        </svg>
      )
    },
    {
      href: 'https://www.facebook.com/cornelldti',
      label: 'Cornell DTI Facebook',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="stroke-current"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.5 12.0625C22.5 6.26406 17.7984 1.5625 12 1.5625C6.20156 1.5625 1.5 6.26406 1.5 12.0625C1.5 17.3031 5.33906 21.647 10.3594 22.4355V15.0986H7.69266V12.0625H10.3594V9.74922C10.3594 7.11812 11.9273 5.66359 14.3255 5.66359C15.4744 5.66359 16.6763 5.86891 16.6763 5.86891V8.45312H15.3516C14.048 8.45312 13.6402 9.26219 13.6402 10.0937V12.0625H16.552L16.087 15.0986H13.6406V22.4364C18.6609 21.6484 22.5 17.3045 22.5 12.0625Z"
            fill="currentColor"
          />
        </svg>
      )
    },
    {
      href: 'https://www.instagram.com/cornelldti',
      label: 'Cornell DTI Instagram',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="stroke-current"
        >
          <path
            d="M16.3748 3.24984C17.5342 3.25331 18.6451 3.71539 19.4648 4.53517C20.2846 5.35495 20.7467 6.46582 20.7502 7.62516V16.3748C20.7467 17.5342 20.2846 18.6451 19.4648 19.4648C18.6451 20.2846 17.5342 20.7467 16.3748 20.7502H7.62516C6.46582 20.7467 5.35495 20.2846 4.53517 19.4648C3.71539 18.6451 3.25331 17.5342 3.24984 16.3748V7.62516C3.25331 6.46582 3.71539 5.35495 4.53517 4.53517C5.35495 3.71539 6.46582 3.25331 7.62516 3.24984H16.3748ZM16.3748 1.5H7.62516C4.25625 1.5 1.5 4.25625 1.5 7.62516V16.3748C1.5 19.7437 4.25625 22.5 7.62516 22.5H16.3748C19.7437 22.5 22.5 19.7437 22.5 16.3748V7.62516C22.5 4.25625 19.7437 1.5 16.3748 1.5Z"
            fill="currentColor"
          />
          <path
            d="M17.6873 7.625C17.4278 7.625 17.174 7.54802 16.9582 7.4038C16.7423 7.25959 16.5741 7.0546 16.4748 6.81477C16.3754 6.57494 16.3494 6.31104 16.4001 6.05644C16.4507 5.80184 16.5757 5.56798 16.7593 5.38442C16.9428 5.20087 17.1767 5.07586 17.4313 5.02522C17.6859 4.97458 17.9498 5.00057 18.1896 5.09991C18.4294 5.19925 18.6344 5.36748 18.7786 5.58331C18.9229 5.79915 18.9998 6.05291 18.9998 6.3125C19.0002 6.48496 18.9665 6.6558 18.9007 6.81521C18.8349 6.97462 18.7382 7.11945 18.6163 7.24141C18.4943 7.36336 18.3495 7.46002 18.1901 7.52585C18.0306 7.59168 17.8598 7.62537 17.6873 7.625ZM12 8.49969C12.6923 8.49969 13.369 8.70497 13.9446 9.08957C14.5202 9.47417 14.9688 10.0208 15.2337 10.6604C15.4986 11.3 15.568 12.0037 15.4329 12.6827C15.2978 13.3617 14.9645 13.9853 14.475 14.4748C13.9855 14.9643 13.3618 15.2977 12.6828 15.4327C12.0039 15.5678 11.3001 15.4985 10.6606 15.2336C10.021 14.9686 9.47433 14.52 9.08973 13.9444C8.70513 13.3688 8.49985 12.6921 8.49985 11.9998C8.50084 11.0718 8.86992 10.1821 9.52611 9.52596C10.1823 8.86976 11.072 8.50068 12 8.49969ZM12 6.74984C10.9617 6.74984 9.94662 7.05775 9.08326 7.63463C8.2199 8.21151 7.54699 9.03144 7.14963 9.99076C6.75227 10.9501 6.64831 12.0057 6.85088 13.0241C7.05345 14.0425 7.55347 14.9779 8.28769 15.7122C9.02192 16.4464 9.95738 16.9464 10.9758 17.149C11.9942 17.3515 13.0498 17.2476 14.0091 16.8502C14.9684 16.4529 15.7883 15.7799 16.3652 14.9166C16.9421 14.0532 17.25 13.0382 17.25 11.9998C17.25 10.6075 16.6969 9.2721 15.7123 8.28753C14.7277 7.30297 13.3924 6.74984 12 6.74984Z"
            fill="currentColor"
          />
        </svg>
      )
    },
    {
      href: 'https://www.linkedin.com/company/cornelldti',
      label: 'Cornell DTI LinkedIn',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="stroke-current"
        >
          <path
            d="M20.8205 1.5H3.29437C2.33672 1.5 1.5 2.18906 1.5 3.13547V20.7005C1.5 21.652 2.33672 22.5 3.29437 22.5H20.8153C21.7781 22.5 22.5 21.6464 22.5 20.7005V3.13547C22.5056 2.18906 21.7781 1.5 20.8205 1.5ZM8.00953 19.0045H5.00109V9.65063H8.00953V19.0045ZM6.60938 8.22844H6.58781C5.625 8.22844 5.00156 7.51172 5.00156 6.61453C5.00156 5.70094 5.64141 5.00109 6.62578 5.00109C7.61016 5.00109 8.2125 5.69578 8.23406 6.61453C8.23359 7.51172 7.61016 8.22844 6.60938 8.22844ZM19.0045 19.0045H15.9961V13.89C15.9961 12.6647 15.5583 11.8275 14.4698 11.8275C13.6383 11.8275 13.1461 12.39 12.9272 12.938C12.8452 13.1348 12.8231 13.403 12.8231 13.6767V19.0045H9.81469V9.65063H12.8231V10.9523C13.2609 10.3289 13.9448 9.43172 15.5363 9.43172C17.5111 9.43172 19.005 10.7334 19.005 13.5398L19.0045 19.0045Z"
            fill="currentColor"
          />
        </svg>
      )
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
              className="text-foreground-3 hover:text-foreground-1 font-medium rounded-sm focusState transition-[color] duration-[120ms]"
            >
              {label}
            </Link>

            {label === 'Design system' && <Chip label="beta" />}
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
      <Link href={'/'} className="inline-flex rounded-sm focusState activeState interactive">
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
    relative before:content-[''] before:absolute before:-top-px before:-left-px before:w-[calc(100%+2px)] before:h-[calc(100%+1px)] before:z-[-2] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] before:sm:rounded-t-2xl"
    >
      <div className="p-4 md:p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:p-8 md:pb-0 md:row-start-1 md:col-start-1 lg:row-auto lg:col-auto lg:pb-8">
          <DTILogoSection />
        </div>

        <div className="pt-8 pb-8 md:p-8 md:row-start-2 md:col-start-1 lg:row-auto lg:col-auto">
          <DTILinksSection />
        </div>

        <div className="md:p-8 md:row-start-2 md:col-start-2 lg:row-auto lg:col-auto">
          <ProductLinksSection />
        </div>

        <div className="sm:absolute bottom-4 right-4 md:top-8 md:right-8 md:bottom-auto">
          <Button
            label="Back to top"
            variant="secondary"
            backToTop={<Image src="/arrowLogo.svg" alt="" width={25} height={25} />}
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          />
        </div>
      </div>
    </footer>
  );
}
