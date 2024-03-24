import { useRef, useState } from 'react';
import MemberGroup from './MemberGroup';
import Icon from '../icons';
import FA23Members from '../../../backend/src/members-archive/fa23.json';
import teamRoles from './team.json';
import { populateMembers } from '../../src/app/utils';

type DisplayCategory = 'Full Team' | 'Leads' | 'Design' | 'Product' | 'Business' | 'Development';

const MemberDisplay: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<DisplayCategory>('Full Team');
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);

  const memberDetailsRef = useRef<HTMLInputElement>(null);

  const allMembers = FA23Members.members as IdolMember[];

  const { roleIcons } = teamRoles;
  const roles = teamRoles.roles as {
    [key in Role]: {
      roleName: string;
      description: string;
      members: IdolMember[];
      order: string[];
    };
  };

  populateMembers(roles, allMembers);

  return (
    <div
      className="flex justify-center bg-[#f6f6f6] w-fit"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (
          !(target.id === 'memberCard' || target.parentElement?.id === 'memberCard') &&
          !memberDetailsRef.current?.contains(target)
        )
          setSelectedMember(undefined);
      }}
    >
      <div className="flex flex-col xl:mx-60 lg:mx-20 md:mx-10 gap-[72px]">
        <div className="flex flex-col lg:w-4/5 md:w-full mt-[100px]">
          <h1 className="text-4xl font-semibold">Introducing the team</h1>
          <p className="mt-6 text-lg">
            Learn more about the team at DTI and what we do behind the scenes. Our design,
            development, business, and product teams all strive to use creativity and innovation to
            make DTI's products more impactful and functional.
          </p>
        </div>
        <div className="flex justify-between">
          {roleIcons.map((role) => (
            <div
              className={`flex flex-col items-center h-[111px] ${
                selectedRole === role.altText ? '' : 'opacity-50'
              } hover:opacity-100`}
              key={role.altText}
            >
              <h3 className="font-semibold text-xl mb-4">{role.altText}</h3>
              <Icon
                icon={`${role.src}_base.svg`}
                hoverIcon={`${role.src}_sticker.svg`}
                activeIcon={`${role.src}_shadow.svg`}
                altText={role.altText}
                isActive={selectedRole === role.altText}
                onClick={() => {
                  setSelectedRole(role.altText as DisplayCategory);
                  setSelectedMember(undefined);
                }}
                width={role.width}
                height={role.height}
                className={`lg:h-[66px] md:h-[50px] w-auto ${
                  selectedRole === role.altText ? 'scale-125' : ''
                } hover:scale-125`}
              />
            </div>
          ))}
        </div>
        <div>
          {Object.keys(roles).map((role) => {
            const value = roles[role as Role];
            if (role === 'tpm') return <></>;
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
  );
};
export default MemberDisplay;
