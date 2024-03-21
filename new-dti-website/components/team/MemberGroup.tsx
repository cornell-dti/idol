import { Dispatch, SetStateAction, useMemo, useState, RefObject } from 'react';
import { Card } from '../ui/card';
import Image from 'next/image';
import { ibm_plex_mono } from '../../src/app/layout';

type MemberSummaryProps = {
  image: string;
  firstName: string;
  lastName: string;
  role: string;
  roleDescription: string;
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
  const chipColor =
    role === 'lead'
      ? '#FFD0D0'
      : role === 'designer'
      ? '#ADD3F9'
      : role === 'pm'
      ? '#DEBDFE'
      : role === 'business'
      ? '#F9D6AD'
      : '#BCECC3';

  return (
    <div id="memberCard" className="flex flex-col gap-3">
      <img
        src={image}
        className={`rounded-md ${enlarged ? 'w-[244px] h-[255px]' : 'w-[202px] h-[208px]'}`}
      />
      <h3
        className={`font-${enlarged ? 'semibold text-2xl' : 'bold text-[22px]'}`}
      >{`${firstName} ${lastName}`}</h3>
      <p
        className={`w-fit px-3 py-1 rounded-2xl ${ibm_plex_mono.className} text-sm`}
        style={{ backgroundColor: chipColor }}
      >
        {roleDescription}
      </p>
    </div>
  );
};

type MemberCardProps = {
  onClick: () => void;
  firstName: string;
  lastName: string;
  role: string;
  image: string;
  roleDescription: string;
  cardState: number;
};

const MemberCard: React.FC<MemberCardProps> = (props: MemberCardProps) => {
  return (
    <Card
      id="memberCard"
      className={`p-3 pb-4 h-fit ${
        props.cardState ? 'opacity-100' : 'opacity-70 hover:opacity-100'
      } ${
        props.cardState === 2 && 'shadow-[0_4px_4px_0_#00000040]'
      } hover:shadow-[0_4px_4px_0_#00000040]`}
      onClick={props.onClick}
    >
      <MemberSummary {...props} enlarged={false} />
    </Card>
  );
};

type MemberDetailsProps = {
  onClose: () => void;
  firstName: string;
  lastName: string;
  role: string;
  roleDescription: string;
  graduation: string;
  major: string;
  hometown: string;
  about: string;
  subteams: readonly string[];
  email: string;
  website?: string | null;
  linkedin?: string | null;
  image: string;
};

export const MemberDetails: React.FC<MemberDetailsProps> = (props: MemberDetailsProps) => {
  const [hover, setHover] = useState<boolean>(false);

  const subteam = props.subteams[0] ?? '';
  let subteamName: string = '';
  let subteamLink: string = '';
  const getSubteam = () => {
    switch (subteam) {
      case 'courseplan':
        subteamName = 'CoursePlan';
        subteamLink = 'https://courseplan.io/';
        break;
      case 'reviews':
        subteamName = 'CUReviews';
        subteamLink = 'https://www.cureviews.org/';
        break;
      case 'queuemein':
        subteamName = 'Queue Me In';
        subteamLink = 'https://queueme.in/';
        break;
      case 'cuapts':
        subteamName = 'CU Apts';
        subteamLink = 'https://www.cuapts.org/';
        break;
      case 'idol':
        subteamName = 'IDOL';
        break;
      case 'cornellgo':
        subteamName = 'Cornell GO';
        break;
      case 'leads':
        subteamName = 'Lead';
        break;
      default:
        subteamName = subteam.charAt(0).toUpperCase() + subteam.slice(1);
    }
  };

  getSubteam();

  const connectIcons: {
    [key: string]: {
      src: string;
      link: string;
      height: number;
      width: number;
    };
  } = {
    linkedin: {
      src: '/icons/linkedin.svg',
      link: props.linkedin ?? '',
      height: 20,
      width: 19
    },
    email: {
      src: '/icons/email.svg',
      link: `mailto:${props.email}`,
      height: 21,
      width: 25
    },
    website: {
      src: 'icons/website.svg',
      link: props.website ?? '',
      height: 20,
      width: 19
    }
  };

  return (
    <Card className="flex p-7 rounded-[20px] shadow-[0_4px_4px_0_#00000040] gap-10">
      <div className="w-3/12 lg:flex md:hidden">
        <MemberSummary {...props} enlarged={true} />
      </div>
      <div className="flex flex-col lg:w-8/12 md:w-full gap-10">
        <div>
          <div className="mb-3 font-semibold text-2xl lg:hidden md:block">
            {props.firstName} {props.lastName}
          </div>
          <div className="flex gap-3 justify-between">
            <div className="flex flex-col w-3/12">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-[#877B7B]">GRAD</h3>
                <svg width="100%" height="2" className="ml-3">
                  <path d="M 0 1 L 500 1" stroke="#E4E4E4" strokeWidth="3px" />
                </svg>
              </div>
              <p>{props.graduation || 'January 1000'}</p>
            </div>
            <div className="flex flex-col w-5/12">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-[#877B7B]">MAJOR</h3>
                <svg width="100%" height="2" className="mx-[3%]">
                  <path d="M 0 1 L 500 1" stroke="#E4E4E4" strokeWidth="3px" />
                </svg>
              </div>
              <p>{props.major || 'Computer Science'}</p>
            </div>
            <div className="w-4/12">
              <h3 className="text-lg font-medium text-[#877B7B]">HOMETOWN</h3>
              <p>{props.hometown || 'Mars'}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-xl">About</h2>
          <p>
            {props.about || 'An amazing member of DTI, but not amazing enough to write an about.'}
          </p>
        </div>
        <div className="flex gap-24">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-xl">Subteam</h3>
            <div
              className={`flex text-lg ${
                subteamLink ? 'border-white border-b-black border-2' : ''
              }`}
            >
              {subteamLink ? (
                <a href={subteamLink} className="whitespace-nowrap">
                  {subteamName}
                </a>
              ) : (
                <p>{subteamName}</p>
              )}
              {subteamLink && <Image src="/icons/link.svg" alt="link" height={20} width={20} />}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-xl">Connect</h3>
            <div className="flex gap-6 items-center">
              {Object.keys(connectIcons).map((icon) => {
                const iconDetails = connectIcons[icon];
                return (
                  iconDetails.link && (
                    <a href={iconDetails.link} key={icon}>
                      <Image
                        src={iconDetails.src}
                        alt={icon}
                        height={iconDetails.height}
                        width={iconDetails.width}
                      />
                    </a>
                  )
                );
              })}
            </div>
          </div>
          <div>
            <button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="py-3 px-5 bg-white rounded-xl text-[#A52424] border-[3px] border-[#A52424] 
              hover:bg-[#A52424] hover:text-white"
            >
              <div className="flex gap-3 ">
                <Image
                  src="/icons/calendar.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  className={hover ? 'brightness-0 invert' : ''}
                />
                <p className="font-bold text-lg text-inherit">Chat with me</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <Image
          src="/icons/close.svg"
          width={23}
          height={23}
          alt="close"
          onClick={props.onClose}
          className="m-3 cursor-pointer"
        />
      </div>
    </Card>
  );
};

type MemberGroupProps = {
  roleName: string;
  description: string;
  members: IdolMember[];
  setSelectedMember: Dispatch<SetStateAction<IdolMember | undefined>>;
  selectedMember: IdolMember | undefined;
  selectedRole: string;
  memberDetailsRef: RefObject<HTMLInputElement>;
};

const MemberGroup: React.FC<MemberGroupProps> = ({
  roleName,
  description,
  members,
  setSelectedMember,
  selectedMember,
  selectedRole,
  memberDetailsRef
}) => {
  const selectedMemberIndex: number = useMemo(
    () => (selectedMember ? members.indexOf(selectedMember) : -1),
    [selectedMember]
  );

  const canInsertMemberDetails = (index: number, columns: number): boolean =>
    selectedMember !== undefined &&
    (roleName === selectedRole || selectedRole === 'Full Team') &&
    ((index % columns === columns - 1 &&
      selectedMemberIndex >= index - columns + 1 &&
      selectedMemberIndex <= index) ||
      (index === members.length - 1 &&
        selectedMemberIndex >= members.length - (members.length % columns)));

  return (
    (selectedRole === roleName || selectedRole === 'Full Team') && (
      <div className="mb-[120px]">
        <h2 className="font-semibold text-[32px]">{`${roleName} ${
          roleName !== 'Leads' ? '' : 'Team'
        }`}</h2>
        <p className="mt-3 text-xl">{description}</p>
        <div className="flex flex-row justify-between flex-wrap grid lg:grid-cols-4 md:grid-cols-3 gap-10 mt-10 mb-[100px]">
          {members.map((member, index) => (
            <>
              <MemberCard
                {...member}
                image="martha.png"
                onClick={() => {setSelectedMember(member === selectedMember ? undefined : member)}}
                cardState={selectedMember ? (index === selectedMemberIndex ? 2 : 0) : 1}
              />
              {selectedMember && canInsertMemberDetails(index, 4) && (
                <div className="lg:col-span-4 md:col-span-3" ref={memberDetailsRef}>
                  <MemberDetails
                    {...selectedMember}
                    image="martha.png"
                    onClose={() => setSelectedMember(undefined)}
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

export default MemberGroup;
