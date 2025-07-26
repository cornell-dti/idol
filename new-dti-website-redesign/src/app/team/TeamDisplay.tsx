'use client';

import { useState, useRef } from 'react';
import members from './data/all-members.json';
import teamRoles from './data/roles.json';
import roleIcons from './data/roleIcons.json';
import alumniMembers from './data/alumni.json';
import { MemberCard, MemberDetailsCard } from '../../components/TeamCard';
import SectionSep from '@/components/SectionSep';
import Tabs from '@/components/Tabs';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';

const LAPTOP_COLUMNS = 4;
const TABLET_COLUMNS = 3;
const PHONE_COLUMNS = 2;

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

const populateMembers = (roles: RoleEntry, allMembers: IdolMember[]): RoleEntry =>
  Object.fromEntries(
    Object.entries(roles).map(([key, value]) => [
      key,
      {
        ...value,
        members: allMembers
          .filter((member) => value.roles.includes(member.role))
          .sort((mem1, mem2) => value.roles.indexOf(mem1.role) - value.roles.indexOf(mem2.role))
      }
    ])
  );

const roles = populateMembers(teamRoles as RoleEntry, allMembers);

export default function TeamDisplay() {
  const [selectedRole, setSelectedRole] = useState<string>('Full Team');
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);
  const [clickedSection, setClickedSection] = useState<string | undefined>(undefined);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const memberDetailsRef = useRef<HTMLDivElement>(null);
  const { width } = useScreenSize();

  const alumniRoles = populateMembers(teamRoles as RoleEntry, alumniMembers as IdolMember[]);
  const orderedAlumni = Object.keys(alumniRoles).reduce(
    (acc: IdolMember[], role) =>
      acc.concat(alumniRoles[role].members.filter((member) => !acc.includes(member))),
    []
  );

  const handleMemberClick = (member: IdolMember, roleName: string) => {
    const newMember = member.netid === selectedMember?.netid ? undefined : member;

    if (newMember && member.netid !== selectedMember?.netid) {
      setScrollPosition(window.scrollY);
    }

    setSelectedMember(newMember);
    setClickedSection(newMember ? roleName : undefined);

    if (newMember && member.netid !== selectedMember?.netid) {
      requestAnimationFrame(() =>
        memberDetailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      );
    }
  };

  const renderMemberGrid = (
    members: IdolMember[],
    options: {
      isAlumni?: boolean;
      roleName?: string;
      selectedMember?: IdolMember;
      selectedMemberIndex?: number;
      onMemberClick?: (member: IdolMember, roleName: string) => void;
      memberDetailsRef?: React.RefObject<HTMLDivElement | null>;
    } = {}
  ) => {
    const isMobile = width < TABLET_BREAKPOINT;
    const items = [];
    const {
      isAlumni = false,
      roleName = '',
      selectedMember,
      selectedMemberIndex = -1,
      onMemberClick,
      memberDetailsRef
    } = options;

    let columns = PHONE_COLUMNS;
    if (width >= TABLET_BREAKPOINT) columns = TABLET_COLUMNS;
    if (width >= LAPTOP_BREAKPOINT) columns = LAPTOP_COLUMNS;

    for (let i = 0; i < members.length; i += 1) {
      const member = members[i];
      const isSelected = selectedMember?.netid === member.netid;

      items.push(
        <div
          key={member.netid}
          className={`relative border-r border-border-1 ${(i + 1) % columns === 0 ? 'border-r-0' : ''}`}
        >
          {isAlumni ? (
            <MemberCard
              user={member}
              image={`/team/teamHeadshots/${member.netid}.jpg`}
              selected={false}
              href={member.linkedin || undefined}
            />
          ) : (
            <MemberCard
              user={member}
              image={`/team/teamHeadshots/${member.netid}.jpg`}
              selected={isSelected}
              onClick={() => onMemberClick?.(member, roleName)}
              className="card-clickable"
            />
          )}
        </div>
      );
    }

    // Add filler divs
    const remainder = members.length % columns;
    if (remainder !== 0) {
      const fillers = columns - remainder;
      for (let i = 0; i < fillers; i += 1) {
        items.push(
          <div
            key={`filler-${isAlumni ? 'alumni-' : ''}${i}`}
            className="border-b border-border-1"
          />
        );
      }
    }

    if (!isAlumni && selectedMember && selectedMemberIndex >= 0) {
      const shouldShowDetails =
        (roleName === selectedRole || selectedRole === 'Full Team') && clickedSection === roleName;

      if (shouldShowDetails) {
        const selectedMemberRowIndex = Math.floor(selectedMemberIndex / columns);
        const insertAfterIndex = (selectedMemberRowIndex + 1) * columns - 1;

        let adjustedInsertIndex = insertAfterIndex;
        if (remainder !== 0 && insertAfterIndex >= members.length - 1) {
          adjustedInsertIndex = members.length + (columns - remainder) - 1;
        }

        const detailsComponent = (
          <div
            key={`details-${selectedMember.netid}`}
            className="[@media(min-width:1024px)]:col-span-4 md:col-span-3 col-span-2"
            ref={memberDetailsRef}
          >
            <SectionSep
              grid={true}
              hasX={true}
              isMobile={isMobile}
              onClickX={() => {
                setSelectedMember(undefined);
                requestAnimationFrame(() => {
                  window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                  });
                });
              }}
              xAriaLabel={`Close ${selectedMember.firstName} ${selectedMember.lastName}'s profile`}
            />
            <MemberDetailsCard
              user={selectedMember}
              image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
            />
            <SectionSep grid={true} isMobile={isMobile} />
          </div>
        );

        items.splice(adjustedInsertIndex + 1, 0, detailsComponent);
      }
    }

    return items;
  };

  const RoleSection = (roleKey: string, roleData: any, selectedRole: string) => {
    const selectedMemberIndex = selectedMember
      ? roleData.members.findIndex((member: IdolMember) => member.netid === selectedMember.netid)
      : -1;

    return (
      <div key={roleKey}>
        <div className="flex flex-col md:p-8 p-4 gap-2 border-b-1 border-t-1 border-border-1">
          <h3>{`${roleData.roleName}${roleData.roleName !== 'Leads' ? '' : ' Team'}`}</h3>
          <p className="text-foreground-3">{roleData.description}</p>
        </div>

        {/* Members Grid */}
        <div className="grid [@media(min-width:1024px)]:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-0">
          {renderMemberGrid(roleData.members, {
            roleName: roleData.roleName,
            selectedMember,
            selectedMemberIndex,
            onMemberClick: handleMemberClick,
            memberDetailsRef
          })}
        </div>
      </div>
    );
  };

  const TabContent = (roleName: string) => {
    const isFullTeam = roleName === 'Full Team';

    return (
      <div className="flex flex-col md:gap-32 gap-16">
        {isFullTeam
          ? Object.keys(roles).map((roleKey) => {
              const roleData = roles[roleKey];
              return RoleSection(roleKey, roleData, 'Full Team');
            })
          : (() => {
              const roleKey = Object.keys(roles).find((key) => roles[key].roleName === roleName);
              if (!roleKey) return null;
              const roleData = roles[roleKey];
              return RoleSection(roleKey, roleData, roleName);
            })()}

        {/* Alumni Section - only show for Full Team */}
        {isFullTeam && (
          <div>
            <div className="flex flex-col md:p-8 p-4 gap-2 border-b-1 border-t-1 border-border-1">
              <h3>Alumni & Inactive Members</h3>
            </div>
            <div className="grid [@media(min-width:1024px)]:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-0">
              {renderMemberGrid(orderedAlumni, { isAlumni: true })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = roleIcons.icons.map((role) => ({
    label: role.altText,
    icon: (
      <img
        src={`${role.src}.svg`}
        alt={`${role.altText} icon`}
        width={role.width}
        height={role.height}
      />
    ),
    content: TabContent(role.altText)
  }));

  return (
    <section>
      <div className="flex flex-col pb-0 p-4 md:pb-0 md:p-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="">Introducing the team</h2>
          <p className="text-foreground-3">
            Learn more about the team at DTI and what we do behind the scenes. Our design,
            development, business, and product teams all strive to use creativity and innovation to
            make DTI's products more impactful and functional.
          </p>
        </div>
      </div>
      <Tabs tabs={tabs} />
    </section>
  );
}
