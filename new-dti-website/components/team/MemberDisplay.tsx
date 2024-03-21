import { useRef, useState } from 'react';
import MemberGroup from './MemberGroup';
import Icon from '../icons';
import FA23Members from '../../../backend/src/members-archive/fa23.json';

const MemberDisplay: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('Full Team');
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);

  const memberDetailsRef = useRef<HTMLInputElement>(null);

  const allMembers = FA23Members.members as IdolMember[];
  const roles: {
    [key in Role]: {
      roleName: string;
      description: string;
      members: IdolMember[];
      order: string[];
    };
  } = {
    lead: {
      roleName: 'Leads',
      description: 'Striving to connect and mentor our members for their best growth.',
      members: [],
      order: ['Full Team Lead', 'Product Lead', 'Developer Lead', 'Design Lead', 'Business Lead']
    },
    designer: {
      roleName: 'Design',
      description: 'Designing quality products, keeping users at the center of it all.',
      members: [],
      order: []
    },
    pm: {
      roleName: 'Product',
      description: 'Leading product development to positively impact the community.',
      members: [],
      order: ['Product Manager', 'Associate Product Manager']
    },
    business: {
      roleName: 'Business',
      description: 'Bringing products and events to the community.',
      members: [],
      order: ['Product Marketing Manager', 'Internal Business']
    },
    developer: {
      roleName: 'Development',
      description: 'Building, testing, and optimizing our applications.',
      members: [],
      order: ['Technical PM', 'Developer']
    },
    tpm: {
      roleName: '',
      description: '',
      members: [],
      order: []
    }
  };

  for (const [key, value] of Object.entries(roles)) {
    value.members = allMembers
      .filter((member) =>
        key === 'developer'
          ? member.role === 'developer' || member.role === 'tpm'
          : member.role === key
      )
      .sort(
        (mem1, mem2) =>
          value.order.indexOf(mem1.roleDescription) - value.order.indexOf(mem2.roleDescription)
      );
  }

  const roleIcons = [
    {
      src: '/icons/full-team',
      altText: 'Full Team',
      width: 66,
      height: 66
    },
    {
      src: '/icons/leads',
      altText: 'Leads',
      width: 66,
      height: 66
    },
    {
      src: '/icons/design',
      altText: 'Design',
      width: 66,
      height: 66
    },
    {
      src: '/icons/product',
      altText: 'Product',
      width: 66,
      height: 66
    },
    {
      src: '/icons/business',
      altText: 'Business',
      width: 66,
      height: 66
    },
    {
      src: '/icons/dev',
      altText: 'Development',
      width: 72,
      height: 66
    }
  ];

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
                  setSelectedRole(role.altText);
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
