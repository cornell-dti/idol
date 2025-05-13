import { getColorClass, productLinks } from '@/utils/memberUtils';
import Image from 'next/image';
import Link from 'next/link';

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
      alt={`${user.firstName} ${user.lastName}`}
      className="rounded-lg w-auto h-auto"
      width={232}
      height={232}
    />
    <div className="text-left">
      {enlarged ? (
        <h3>{`${user.firstName} ${user.lastName}`}</h3>
      ) : (
        <h6>{`${user.firstName} ${user.lastName}`}</h6>
      )}
      <p className={`text-${getColorClass(user.role)}`}>{user.roleDescription}</p>
    </div>
  </>
);

type MemberCardProps = {
  user: IdolMember;
  image: string;
  selected: boolean;
  onClick?: () => void;
};

export const MemberCard = ({ user, image, selected, onClick }: MemberCardProps) => {
  const baseStyles =
    'p-8 border border-border-1 flex flex-col gap-4 focusState hover:shadow-white hover:shadow-[0_-4px_8px_0]';

  return (
    <button
      className={`${baseStyles} ${selected ? 'border-b-foreground-1' : ''}`}
      onClick={onClick}
    >
      <MemberSummary user={user} image={image} />
    </button>
  );
};

type MemberDetailsProps = {
  user: IdolMember;
  image: string;
};
export const MemberDetailsCard = ({ user, image }: MemberDetailsProps) => {
  const baseStyles = 'w-1/2 p-8 border border-border-1 flex flex-col';
  return (
    <div className="flex w-full">
      <div className={`${baseStyles} gap-4`}>
        <MemberSummary user={user} image={image} enlarged />
      </div>
      <div className={`${baseStyles} gap-8`}>
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
                className="flex gap-2 items-center"
                target="_blank"
                href={productLinks[user.subteams[0]].link}
              >
                <p className="underline">{productLinks[user.subteams[0]].name}</p>
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
    </div>
  );
};
