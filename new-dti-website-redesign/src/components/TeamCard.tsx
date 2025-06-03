import Image from 'next/image';
import Link from 'next/link';
import { getColorClass, productLinks } from '../utils/memberUtils';
import Button from './Button';

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
      className="rounded-lg w-auto h-auto"
      width={232}
      height={232}
    />
    <div className="text-left">
      {enlarged ? (
        <>
          <h3 className="h4">{`${user.firstName} ${user.lastName}`}</h3>
          <p className={`text-${getColorClass(user.role)} h6`}>{user.roleDescription}</p>
        </>
      ) : (
        <>
          <h6>{`${user.firstName} ${user.lastName}`}</h6>
          <p className={`text-${getColorClass(user.role)}`}>{user.roleDescription}</p>
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

export const MemberCard = ({ user, image, selected, onClick, className = '' }: MemberCardProps) => {
  const baseStyles =
    'relative p-4 sm:p-8 flex flex-col gap-4 hover:bg-background-2 transition-[background-color] duration-[120ms] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:z-10';

  return (
    <article
      className={`${baseStyles} relative overflow-hidden ${
        selected
          ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-foreground-1 after:shadow-[0_-4px_8px_0_var(--foreground-1)] after:rounded-full after:transform after:scale-x-100 after:origin-center after:transition-transform after:duration-200 bg-background-2'
          : 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-foreground-1 after:rounded-full after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-200'
      } ${className}`}
    >
      <MemberSummary user={user} image={image} />
      <button
        className="opacity-0 cursor-pointer after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full"
        onClick={onClick}
      />
    </article>
  );
};

const IconLink = ({
  href,
  children
}: {
  href: string | null | undefined;
  children: React.ReactNode;
}) => {
  if (!href) return null;

  return (
    <Link
      href={href}
      className="interactive activeState rounded-sm text-foreground-1 hover:text-foreground-2"
    >
      {children}
    </Link>
  );
};
type MemberDetailsProps = {
  user: IdolMember;
  image: string;
  showImage?: boolean;
};
export const MemberDetailsCard = ({ user, image, showImage = true }: MemberDetailsProps) => {
  const baseStyles = 'md:w-1/2 flex flex-col';
  return (
    <div className="card-clickable flex w-full flex-col md:flex-row">
      <div className={`${baseStyles} p-8 gap-4 border-r-1 border-border-1`}>
        {showImage !== false && <MemberSummary user={user} image={image} enlarged />}
      </div>
      <div className={`${baseStyles} justify-between`}>
        <div className="flex flex-col p-8 gap-8">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10 2H14V6"
                      stroke="white"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.66602 9.33333L13.9993 2"
                      stroke="white"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                      stroke="white"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
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
        <div className="flex justify-between p-8 border border-transparent border-t-border-1 ">
          <div className="flex gap-4 items-center">
            {user.website && (
              <IconLink href={user.website}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </IconLink>
            )}

            <IconLink href={`mailto:${user.email}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
            </IconLink>

            {user.linkedin && (
              <IconLink href={user.website}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20.8205 1.5H3.29437C2.33672 1.5 1.5 2.18906 1.5 3.13547V20.7005C1.5 21.652 2.33672 22.5 3.29437 22.5H20.8153C21.7781 22.5 22.5 21.6464 22.5 20.7005V3.13547C22.5056 2.18906 21.7781 1.5 20.8205 1.5ZM8.00953 19.0045H5.00109V9.65063H8.00953V19.0045ZM6.60938 8.22844H6.58781C5.625 8.22844 5.00156 7.51172 5.00156 6.61453C5.00156 5.70094 5.64141 5.00109 6.62578 5.00109C7.61016 5.00109 8.2125 5.69578 8.23406 6.61453C8.23359 7.51172 7.61016 8.22844 6.60938 8.22844ZM19.0045 19.0045H15.9961V13.89C15.9961 12.6647 15.5583 11.8275 14.4698 11.8275C13.6383 11.8275 13.1461 12.39 12.9272 12.938C12.8452 13.1348 12.8231 13.403 12.8231 13.6767V19.0045H9.81469V9.65063H12.8231V10.9523C13.2609 10.3289 13.9448 9.43172 15.5363 9.43172C17.5111 9.43172 19.005 10.7334 19.005 13.5398L19.0045 19.0045Z"
                    fill="currentColor"
                  />
                </svg>
              </IconLink>
            )}
            {user.github && (
              <IconLink href={user.website}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 1.5C6.20156 1.5 1.5 6.32344 1.5 12.2672C1.5 17.025 4.50937 21.0562 8.68125 22.4812C8.73977 22.494 8.79949 22.5002 8.85938 22.5C9.24844 22.5 9.39844 22.2141 9.39844 21.9656C9.39844 21.7078 9.38906 21.0328 9.38437 20.1328C9.03705 20.2142 8.68173 20.2567 8.325 20.2594C6.30469 20.2594 5.84531 18.6891 5.84531 18.6891C5.36719 17.4469 4.67813 17.1141 4.67813 17.1141C3.76406 16.4719 4.67344 16.4531 4.74375 16.4531H4.74844C5.80313 16.5469 6.35625 17.5687 6.35625 17.5687C6.88125 18.4875 7.58437 18.7453 8.2125 18.7453C8.62783 18.737 9.03673 18.6412 9.4125 18.4641C9.50625 17.7703 9.77812 17.2969 10.0781 17.025C7.74844 16.7531 5.29688 15.8297 5.29688 11.7047C5.29688 10.5281 5.70469 9.56719 6.375 8.81719C6.26719 8.54531 5.90625 7.44844 6.47812 5.96719C6.55483 5.94883 6.63368 5.94095 6.7125 5.94375C7.09219 5.94375 7.95 6.08906 9.36563 7.07344C11.0857 6.59218 12.9049 6.59218 14.625 7.07344C16.0406 6.08906 16.8984 5.94375 17.2781 5.94375C17.3569 5.94095 17.4358 5.94883 17.5125 5.96719C18.0844 7.44844 17.7234 8.54531 17.6156 8.81719C18.2859 9.57187 18.6937 10.5328 18.6937 11.7047C18.6937 15.8391 16.2375 16.7484 13.8984 17.0156C14.2734 17.3484 14.6109 18.0047 14.6109 19.0078C14.6109 20.4469 14.5969 21.6094 14.5969 21.9609C14.5969 22.2141 14.7422 22.5 15.1312 22.5C15.1942 22.5003 15.2571 22.494 15.3187 22.4812C19.4953 21.0562 22.5 17.0203 22.5 12.2672C22.5 6.32344 17.7984 1.5 12 1.5Z"
                    fill="currentColor"
                  />
                </svg>
              </IconLink>
            )}
          </div>
          <Button label={'Chat with me'} href={user.coffeeChatLink || `mailto:${user.email}`} />
        </div>
      </div>
    </div>
  );
};
