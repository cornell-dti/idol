import { forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRoleColor, productLinks } from '../utils/memberUtils';
import Button from './Button';
import OpenIcon from './icons/OpenIcon';
import GlobeIcon from './icons/GlobeIcon';
import MailIcon from './icons/MailIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';
import Chip, { ChipColor } from './Chip';

const MemberSummary = ({
  user,
  image,
  enlarged = false
}: {
  user: IdolMember;
  image: string;
  enlarged?: boolean;
}) => (
  <>
    <Image
      src={image}
      alt={`${user.firstName} ${user.lastName}'s profile picture`}
      className="rounded-lg w-auto h-auto transform transition-all duration-120 ease-in-out group-active:scale-97"
      width={232}
      height={232}
    />
    <div className={`text-left flex flex-col ${enlarged ? 'gap-3' : 'gap-1'}`}>
      {enlarged ? (
        <>
          <h3 className="h4">{`${user.firstName} ${user.lastName}`}</h3>

          <Chip label={user.roleDescription} color={getRoleColor(user.role) as ChipColor} />
        </>
      ) : (
        <>
          <h6>{`${user.firstName} ${user.lastName}`}</h6>

          <Chip label={user.roleDescription} color={getRoleColor(user.role) as ChipColor} />
        </>
      )}
    </div>
  </>
);

type MemberCardProps = {
  user: IdolMember;
  image: string;
  selected: boolean;
  className?: string;
  onClick?: () => void;
};

export const MemberCard = forwardRef<HTMLDivElement, MemberCardProps>(
  ({ user, image, selected, onClick, className = '' }, ref) => {
    const baseStyles =
      'relative p-4 sm:p-8 flex flex-col gap-4 hover:bg-background-2 transition-[background-color] duration-[120ms] has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:z-10 border-b-1 border-border-1';

    return (
      <article
        ref={ref}
        className={`${baseStyles} relative overflow-hidden group ${
          selected
            ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-foreground-1 after:shadow-[0_-4px_8px_0_var(--foreground-1)]  after:transform after:scale-x-100 after:origin-center after:transition-transform after:duration-200 bg-background-2'
            : 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-foreground-1 after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-200'
        } ${className}`}
      >
        <MemberSummary user={user} image={image} />
        <button
          className="opacity-0 cursor-pointer after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full"
          onClick={onClick}
          aria-label={`Open ${user.firstName} ${user.lastName}'s profile`}
        />
      </article>
    );
  }
);

const IconLink = ({
  href,
  children,
  label
}: {
  href: string | null | undefined;
  children: React.ReactNode;
  label: string;
}) => {
  if (!href) return null;

  return (
    <Link
      href={href}
      className="interactive activeState rounded-sm text-foreground-1 hover:text-foreground-2"
      aria-label={label}
    >
      {children}
    </Link>
  );
};

type MemberDetailsProps = {
  user: IdolMember;
  image: string;
  showImage?: boolean;
  scrollRef?: React.Ref<HTMLDivElement>;
};

export const MemberDetailsCard = ({
  user,
  image,
  showImage = true,
  scrollRef
}: MemberDetailsProps) => {
  const baseStyles = 'md:w-1/2 flex flex-col';
  return (
    <div className="card-clickable flex w-full flex-col md:flex-row border-b-1 border-border-1">
      {showImage !== false && (
        <div className={`${baseStyles} p-8 gap-4 border-r-1 border-border-1`}>
          <MemberSummary user={user} image={image} enlarged />
        </div>
      )}

      <div className={`${baseStyles} justify-between`}>
        <div
          className={`flex flex-col gap-8 ${showImage ? 'p-4 md:p-8 md:pt-8' : 'p-4 pt-4 md:p-8 md:pt-8'}`}
        >
          <div className="flex gap-8">
            <div className="w-1/2">
              <p className="text-foreground-3">Graduating</p>
              <p>{user.graduation}</p>
            </div>
            <div className="w-1/2">
              <p className="text-foreground-3">Major</p>
              <p>{`${user.major}${user.doubleMajor ? ` & ${user.doubleMajor}` : ''}`}</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-1/2">
              <p className="text-foreground-3">Hometown</p>
              <p>{user.hometown}</p>
            </div>
            <div className="w-1/2">
              <p className="text-foreground-3">Subteam</p>
              {user.subteams[0] in productLinks ? (
                <Link
                  className="flex gap-2 items-center focusState w-fit rounded-sm"
                  target="_blank"
                  href={productLinks[user.subteams[0]].link}
                >
                  <p className="underline underline-offset-3">
                    {productLinks[user.subteams[0]].name}
                  </p>
                  <OpenIcon size={20} />
                </Link>
              ) : (
                <div>{productLinks[user.subteams[0]].name}</div>
              )}
            </div>
          </div>
          <div>
            <p className="text-foreground-3">About</p>
            <div className="flex flex-col gap-2">
              {user.about.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between sm:p-8 p-4 border border-transparent border-t-border-1 ">
          <div className="flex gap-4 items-center">
            {user.website && (
              <IconLink
                href={user.website}
                label={`Link to ${user.firstName} ${user.lastName}'s website`}
              >
                <GlobeIcon />
              </IconLink>
            )}

            <IconLink
              href={`mailto:${user.email}`}
              label={`Email ${user.firstName} ${user.lastName}`}
            >
              <MailIcon />
            </IconLink>

            {user.linkedin && (
              <IconLink
                href={user.website}
                label={`Link to ${user.firstName} ${user.lastName}'s LinkedIn`}
              >
                <LinkedInIcon />
              </IconLink>
            )}
            {user.github && (
              <IconLink
                href={user.website}
                label={`Link to ${user.firstName} ${user.lastName}'s GitHub`}
              >
                <GitHubIcon />
              </IconLink>
            )}
          </div>
          <Button label={'Chat with me'} href={user.coffeeChatLink || `mailto:${user.email}`} />
        </div>
      </div>
      <div ref={scrollRef} className="md:-mt-65" />
    </div>
  );
};
