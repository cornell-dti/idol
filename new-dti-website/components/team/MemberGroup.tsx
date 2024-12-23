import { useState, RefObject } from 'react';
import Image from 'next/image';

import { Card } from '../ui/card';
import teamRoles from './data/roles.json';
import subteams from './data/subteams.json';
import connectIcons from './data/connectIcons.json';
import { getGeneralRole } from '../../src/utils/memberUtils';
import useScreenSize from '../../src/hooks/useScreenSize';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../../src/consts';

type MemberSummaryProps = {
  image: string;
  firstName: string;
  lastName: string;
  role: string;
  roleDescription: RoleDescription;
  enlarged: boolean;
};

const MemberSummary: React.FC<MemberSummaryProps> = ({
  image,
  firstName,
  lastName,
  role,
  roleDescription,
  enlarged
}) => {
  const chipColor = teamRoles[getGeneralRole(role as Role)].color;

  return (
    <div
      className={`memberCard card-clickable flex h-full flex-col md:gap-3 xs:gap-2 xs:text-[16px] justify-between ${
        enlarged ? 'md:text-2xl' : 'md:text-lg'
      }`}
    >
      <div className="card-clickable flex flex-col md:gap-3 xs:gap-2 justify-between">
        <img
          src={image}
          alt={`${firstName}-${lastName}`}
          className={`rounded-md ${
            enlarged ? 'h-[244px] w-[244px]' : 'md:h-[238px] xs:h-[202px] w-full'
          } object-cover`}
        />
        <h3
          className={`text-left font-${enlarged ? 'semibold' : 'bold'}`}
        >{`${firstName} ${lastName}`}</h3>
      </div>
      <p
        className="w-fit h-[32px] flex items-center px-[12px] py-[4px] rounded-2xl text-[14px]"
        style={{ backgroundColor: chipColor }}
      >
        {roleDescription}
      </p>
    </div>
  );
};

type MemberCardProps = {
  firstName: string;
  lastName: string;
  role: string;
  image: string;
  roleDescription: RoleDescription;
  cardState: number | undefined;
};

const MemberCard: React.FC<MemberCardProps> = (props: MemberCardProps) => (
  <Card
    className={`memberCard card-clickable w-full md:p-3 md:pb-4 xs:p-2 xs:pb-3 h-fit grow ${
      props.cardState ? 'opacity-70 hover:opacity-100' : 'opacity-100'
    }`}
  >
    <MemberSummary {...props} enlarged={false} />
  </Card>
);

type MemberDetailsProps = {
  onClose: () => void;
  firstName: string;
  lastName: string;
  role: Role;
  roleDescription: RoleDescription;
  graduation: string;
  major: string;
  hometown: string;
  about: string;
  subteams: readonly string[];
  email: string;
  website?: string | null;
  linkedin?: string | null;
  image: string;
  coffeeChatLink?: string | null;
};

export const MemberDetails: React.FC<MemberDetailsProps> = (props: MemberDetailsProps) => {
  const [hover, setHover] = useState<boolean>(false);
  const mouseHandler = () => setHover((prev) => !prev);

  const subteam = props.subteams[0] ?? '';
  const { name, link } = subteam
    ? (subteams as { [key: string]: { name: string; link: string } })[subteam]
    : { name: 'No Subteam', link: '' };

  return (
    <Card className="flex flex-col gap-5 md:p-7 xs:p-4 xs:pr-2 rounded-lg">
      <div className="flex lg:gap-10">
        <div className="w-3/12 lg:flex xs:hidden">
          <MemberSummary {...props} enlarged={true} />
        </div>
        <div className="flex flex-col lg:w-8/12 xs:w-11/12 md:gap-10 xs:gap-5">
          <div className="flex flex-col gap-3">
            <div className="font-semibold md:text-2xl xs:text-lg lg:hidden md:block">
              {props.firstName} {props.lastName}
            </div>
            <div className="flex gap-3 justify-between">
              <div className="flex flex-col md:w-3/12 xs:w-1/3">
                <div className="flex items-center">
                  <h3 className="md:text-lg xs:text-xs font-medium text-[#877B7B]">GRAD</h3>
                  <svg width="100%" height="2" className="ml-3">
                    <path d="M 0 1 L 500 1" stroke="#E4E4E4" strokeWidth="3px" />
                  </svg>
                </div>
                <p className="md:text-lg xs:text-sm">{props.graduation ?? ''}</p>
              </div>
              <div className="flex flex-col md:w-5/12 xs:w-2/3">
                <div className="flex items-center">
                  <h3 className="md:text-lg xs:text-xs font-medium text-[#877B7B]">MAJOR</h3>
                  <svg width="100%" height="2" className="mx-[3%] md:block xs:hidden">
                    <path d="M 0 1 L 500 1" stroke="#E4E4E4" strokeWidth="3px" />
                  </svg>
                </div>
                <p className="md:text-lg xs:text-sm">{props.major ?? ''}</p>
              </div>
              <div className="w-4/12 md:block xs:hidden">
                <h3 className="md:text-lg xs:text-xs font-medium text-[#877B7B]">HOMETOWN</h3>
                <p className="md:text-lg xs:text-sm">{props.hometown ?? ''}</p>
              </div>
            </div>
            <div className="md:hidden xs:block">
              <h3 className="md:text-lg xs:text-xs font-medium text-[#877B7B]">HOMETOWN</h3>
              <p className="md:text-lg xs:text-sm">{props.hometown ?? ''}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold md:text-xl xs:text-base">About</h2>
            <p className="md:text-lg xs:text-sm whitespace-pre-wrap">
              {props.about || 'An amazing member of DTI.'}
            </p>
          </div>
          <div className="flex justify-around">
            <div className="flex flex-col gap-2 md:w-1/3 xs:w-1/2">
              <h3 className="font-semibold md:text-xl xs:text-base">Subteam</h3>
              <div
                className={`flex w-max md:text-lg xs:text-sm items-center ${
                  link ? 'border-white border-b-black border-2 w-fit' : ''
                }`}
              >
                {link ? (
                  <a href={link} className="flex whitespace-nowrap">
                    {name}
                    {link && <Image src="/icons/link.svg" alt="link" height={20} width={20} />}
                  </a>
                ) : (
                  <p>{name}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 md:w-1/3 xs:w-1/2">
              <h3 className="font-bold md:text-xl xs:text-base gap-2">Connect</h3>
              <div className="flex gap-6 items-center">
                {connectIcons.icons.map((icon) => {
                  const link = props[icon.alt as keyof typeof props] as string | null;
                  return (
                    link && (
                      <a
                        href={icon.alt === 'email' ? `mailto:${link}` : `${link}`}
                        key={icon.alt}
                        className="icons"
                      >
                        <Image
                          src={icon.src}
                          alt={icon.alt}
                          height={icon.height}
                          width={icon.width}
                          className="opacity-100 hover:opacity-60"
                        />
                      </a>
                    )
                  );
                })}
              </div>
            </div>
            <div className="md:block xs:hidden">
              <a
                href={props.coffeeChatLink ?? `mailto:${props.email}`}
                onMouseEnter={mouseHandler}
                onMouseLeave={mouseHandler}
                className="flex items-center justify-center gap-3 py-3 px-5 bg-white rounded-xl text-[#A52424] border-[3px] border-[#A52424] 
             hover:bg-[#A52424] hover:text-white stroke-white w-max"
                aria-label={`schedule coffee chat with ${props.firstName} ${props.lastName}`}
              >
                <Image
                  src="/icons/red_calendar.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  className={hover ? 'coffee-calendar-hover' : ''}
                />
                <p className="font-bold text-lg text-inherit whitespace-nowrap">Chat with me</p>
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={props.onClose}
          className="cursor-pointer h-min rounded-md"
          aria-label="Close member details"
        >
          <Image src="/icons/close.svg" width={23} height={23} alt="" className="m-2 xs:w-4" />
        </button>
      </div>
      <div className="md:hidden xs:block">
        <a
          href={props.coffeeChatLink ?? `mailto:${props.email}`}
          onMouseEnter={mouseHandler}
          onMouseLeave={mouseHandler}
          className="py-3 px-5 bg-white rounded-xl text-[#A52424] border-[3px] border-[#A52424] 
              hover:bg-[#A52424] hover:text-white stroke-white w-full flex justify-center"
          aria-label={`schedule coffee chat with ${props.firstName} ${props.lastName}`}
        >
          <div className="flex gap-3 w-max">
            <Image
              src="/icons/red_calendar.svg"
              alt="calendar"
              width={24}
              height={24}
              className={hover ? 'coffee-calendar-hover' : ''}
            />
            <p className="font-bold text-base text-inherit whitespace-nowrap">Chat with me</p>
          </div>
        </a>
      </div>
    </Card>
  );
};

type MemberGroupProps = {
  roleName?: string;
  description?: string;
  members: IdolMember[];
  setSelectedMember: (member?: IdolMember) => void;
  selectedMember?: IdolMember;
  selectedRole?: string;
  memberDetailsRef: RefObject<HTMLInputElement>;
  displayDetails?: boolean;
  isCard: boolean;
};

const MemberGroup: React.FC<MemberGroupProps> = ({
  roleName,
  description,
  members,
  setSelectedMember,
  selectedMember,
  selectedRole = 'Full Team',
  displayDetails = true,
  memberDetailsRef,
  isCard
}) => {
  const selectedMemberIndex: number =
    displayDetails && selectedMember ? members.indexOf(selectedMember) : -1;

  const { width } = useScreenSize();
  const LAPTOP_COLUMNS = 4;
  const TABLET_COLUMNS = 3;
  const PHONE_COLUMNS = 2;

  /**
   * Determines whether the selected member details can be inserted after the current index.
   * @param index The index of a member relative to its member group.
   */
  const canInsertMemberDetails = (index: number): boolean => {
    // The number of columns in the member group grid.
    let columns = LAPTOP_COLUMNS;
    switch (true) {
      case TABLET_BREAKPOINT < width && width <= LAPTOP_BREAKPOINT:
        columns = TABLET_COLUMNS;
        break;
      case width <= TABLET_BREAKPOINT:
        columns = PHONE_COLUMNS;
    }

    if (selectedMember === undefined) return false;
    if (roleName !== selectedRole && selectedRole !== 'Full Team') return false;

    return (
      // Case where member of index is not on last row
      (index % columns === columns - 1 &&
        selectedMemberIndex >= index - columns + 1 &&
        selectedMemberIndex <= index) ||
      // Case where member of index is on last row
      (index === members.length - 1 &&
        selectedMemberIndex >= members.length - (members.length % columns))
    );
  };

  const onCloseMemberDetails = () => setSelectedMember(undefined);
  const onMemberCardClick = (member: IdolMember) => {
    setSelectedMember(member.netid === selectedMember?.netid ? undefined : member);
    if (member.netid !== selectedMember?.netid) {
      requestAnimationFrame(() =>
        memberDetailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      );
    }
  };

  return isCard ? (
    <div className="flex flex-row justify-center flex-wrap gap-x-14 gap-y-10">
      {members.map((member, index) => (
        <>
          <button
            onClick={() => onMemberCardClick(member)}
            className="memberCard card-clickable flex flex-col items-center custom-focus-state"
            aria-label={`open ${member.firstName} ${member.lastName}'s details`}
          >
            <MemberCard
              {...member}
              key={member.netid}
              image={`team/${member.netid}.jpg`}
              cardState={selectedMember ? index - selectedMemberIndex : undefined}
            />
          </button>
          {selectedMember && canInsertMemberDetails(index) && (
            <div
              className="lg:col-span-4 md:col-span-3 xs:col-span-2 rounded-lg"
              ref={memberDetailsRef}
            >
              <MemberDetails
                {...selectedMember}
                image={`team/${selectedMember.netid}.jpg`}
                onClose={onCloseMemberDetails}
              />
            </div>
          )}
        </>
      ))}
    </div>
  ) : (
    (selectedRole === roleName || selectedRole === 'Full Team') && (
      <div className="md:mb-[120px] xs:mb-10">
        <h2 className="font-semibold md:text-[32px] xs:text-2xl">{`${roleName} ${
          roleName !== 'Leads' ? '' : 'Team'
        }`}</h2>
        <p className="mt-3 md:text-xl xs:text-sm">{description}</p>
        <div
          className="grid lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 md:gap-10 
              xs:gap-5 md:mt-10 xs:mt-5"
        >
          {members.map((member, index) => (
            <>
              <button
                onClick={() => onMemberCardClick(member)}
                className="memberCard card-clickable flex flex-col items-center custom-focus-state"
                aria-label={`open ${member.firstName} ${member.lastName}'s details`}
              >
                <MemberCard
                  {...member}
                  key={member.netid}
                  image={`team/${member.netid}.jpg`}
                  cardState={selectedMember ? index - selectedMemberIndex : undefined}
                />
              </button>
              {selectedMember && canInsertMemberDetails(index) && displayDetails && (
                <div
                  className="lg:col-span-4 md:col-span-3 xs:col-span-2"
                  ref={canInsertMemberDetails(index) ? memberDetailsRef : undefined}
                >
                  <MemberDetails
                    {...selectedMember}
                    image={`team/${selectedMember.netid}.jpg`}
                    onClose={onCloseMemberDetails}
                  />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    )
  );
};

export { MemberCard };
export default MemberGroup;
