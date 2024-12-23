import { useRef, useState } from 'react';
import MemberGroup, { MemberCard } from './MemberGroup';
import Icon from '../icons';
import members from './data/all-members.json';
import teamRoles from './data/roles.json';
import roleIcons from './data/roleIcons.json';
import { populateMembers } from '../../src/utils/memberUtils';
import alumniMembers from './data/alumni.json';
import SectionWrapper from '../hoc/SectionWrapper';

const allMembers = members as IdolMember[];

type RoleEntry = {
  [key: string]: {
    roleName: string;
    description: string;
    members: IdolMember[];
    roles: string[];
    color: string;
  };
};

const roles = populateMembers(teamRoles as RoleEntry, allMembers);

const MemberDisplay: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('Full Team');
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);
  const [clickedSection, setClickedSection] = useState<string | undefined>(undefined);

  // Make roles in alumni section the same order as full team
  const alumniRoles = populateMembers(teamRoles as RoleEntry, alumniMembers as IdolMember[]);
  const orderedAlumni = Object.keys(alumniRoles).reduce(
    (acc: IdolMember[], role) =>
      acc.concat(alumniRoles[role].members.filter((member) => !acc.includes(member))),
    []
  );
  const memberDetailsRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="flex justify-center bg-[#f6f6f6]"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (
          !(
            target.classList.contains('card-clickable') ||
            target.parentElement?.classList.contains('card-clickable')
          ) &&
          !memberDetailsRef.current?.contains(target)
        )
          setSelectedMember(undefined);
      }}
    >
      <SectionWrapper id={'Member display wrapper'}>
        <div className="flex flex-col gap-[72px]">
          <div className="flex flex-col lg:w-4/5 md:w-full mt-[100px]">
            <h2 className="md:text-4xl xs:text-2xl font-semibold">Introducing the team</h2>
            <p className="mt-6 md:text-lg xs:text-sm">
              Learn more about the team at DTI and what we do behind the scenes. Our design,
              development, business, and product teams all strive to use creativity and innovation
              to make DTI's products more impactful and functional.
            </p>
          </div>
          <div className="grid md:grid-cols-6 xs:grid-cols-3 justify-between">
            {roleIcons.icons.map((role) => (
              <div
                className={`flex flex-col items-center h-[111px] ${
                  selectedRole === role.altText ? '' : 'opacity-50'
                } hover:opacity-100`}
                key={role.altText}
              >
                <h3 className="font-semibold md:text-xl xs:text-base mb-4">{role.altText}</h3>
                <button
                  onClick={() => {
                    setSelectedRole(role.altText);
                    setSelectedMember(undefined);
                  }}
                  aria-label={`select ${role.altText} role`}
                  className="custom-focus-state"
                >
                  <Icon
                    icon={`${role.src}_base.svg`}
                    hoverIcon={`${role.src}_sticker.svg`}
                    activeIcon={`${role.src}_shadow.svg`}
                    altText={''}
                    ariaLabel={`Show ${role.altText}`}
                    isActive={selectedRole === role.altText}
                    width={role.width}
                    height={role.height}
                    className={`lg:h-[66px] xs:h-[50px] w-auto ${
                      selectedRole === role.altText ? 'scale-125' : ''
                    } hover:scale-125`}
                  />
                </button>
              </div>
            ))}
          </div>
          <div>
            {Object.keys(roles).map((role, index) => {
              const value = roles[role as GeneralRole];
              return (
                <MemberGroup
                  key={value.roleName}
                  {...value}
                  setSelectedMember={(member) => {
                    setSelectedMember(member);
                    setClickedSection(member ? value.roleName : undefined);
                  }}
                  selectedMember={selectedMember}
                  selectedRole={selectedRole}
                  memberDetailsRef={memberDetailsRef}
                  displayDetails={clickedSection ? clickedSection === value.roleName : false}
                  isCard={false}
                />
              );
            })}
          </div>
          {selectedRole === 'Full Team' && (
            <div className="mb-20">
              <h2 className="font-semibold md:text-[32px] xs:text-2xl">
                Alumni & Inactive Members
              </h2>
              <div
                className="grid lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 md:gap-10 
                xs:gap-x-1.5 xs:gap-y-5 md:mt-10 xs:mt-5"
              >
                {orderedAlumni.map((member, index) => (
                  <a
                    href={!member.linkedin ? undefined : member.linkedin}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MemberCard
                      {...member}
                      roleDescription={member.roleDescription as RoleDescription}
                      cardState={undefined}
                      image={`team/${member.netid}.jpg`}
                      key={member.netid}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
};
export default MemberDisplay;
