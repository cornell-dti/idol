import { useRef, useState } from 'react';
import MemberGroup from './MemberGroup';
import Icon from '../icons';
import FA23Members from '../../../backend/src/members-archive/fa23.json';
import teamRoles from './data/roles.json';
import roleIcons from './data/roleIcons.json';
import { populateMembers } from '../../src/utils/memberUtils';

const MemberDisplay: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('Full Team');
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);

  const memberDetailsRef = useRef<HTMLInputElement>(null);

  const allMembers = FA23Members.members as IdolMember[];

  const roles = populateMembers(
    teamRoles as {
      [key: string]: {
        roleName: string;
        description: string;
        members: IdolMember[];
        order: string[];
        color: string;
      };
    },
    allMembers
  );

  return (
    <div
      className="flex justify-center bg-[#f6f6f6]"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (
          !(target.id === 'memberCard' || target.parentElement?.id === 'memberCard') &&
          !memberDetailsRef.current?.contains(target)
        )
          setSelectedMember(undefined);
      }}
    >
      <div className="xs:mx-5 md:mx-10 lg:mx-20 xl:mx-60">
        <div className="flex flex-col gap-[72px] max-w-5xl">
          <div className="flex flex-col lg:w-4/5 md:w-full mt-[100px]">
            <h1 className="md:text-4xl xs:text-2xl font-semibold">Introducing the team</h1>
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
                <Icon
                  icon={`${role.src}_base.svg`}
                  hoverIcon={`${role.src}_sticker.svg`}
                  activeIcon={`${role.src}_shadow.svg`}
                  altText={role.altText}
                  isActive={selectedRole === role.altText}
                  onClick={() => {
                    setSelectedRole(role.altText);
                    setSelectedMember(undefined);
                  }}
                  width={role.width}
                  height={role.height}
                  className={`lg:h-[66px] xs:h-[50px] w-auto ${
                    selectedRole === role.altText ? 'scale-125' : ''
                  } hover:scale-125`}
                />
              </div>
            ))}
          </div>
          <div>
            {Object.keys(roles).map((role) => {
              const value = roles[role as Role];
              if (role === 'tpm' || role === 'dev-advisor') return <></>;
              return (
                <MemberGroup
                  key={value.roleName}
                  {...value}
                  setSelectedMember={setSelectedMember}
                  selectedMember={selectedMember}
                  selectedRole={selectedRole}
                  memberDetailsRef={memberDetailsRef}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MemberDisplay;
