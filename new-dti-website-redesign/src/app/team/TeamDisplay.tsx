'use client';

import { useState, useRef } from 'react';
import members from './data/all-members.json';
import teamRoles from './data/roles.json';
import roleIcons from './data/roleIcons.json';
import alumniMembers from './data/alumni.json';
import { MemberCard, MemberDetailsCard } from '../../components/TeamCard';
import IconButton from '../../components/IconButton';
import XIcon from '../../components/icons/XIcon';
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

const populateMembers = (roles: RoleEntry, allMembers: IdolMember[]): RoleEntry => {
  return Object.fromEntries(
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
};

const roles = populateMembers(teamRoles as RoleEntry, allMembers);

export default function TeamDisplay() {
  const [selectedRole, setSelectedRole] = useState<string>('Full Team');
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);
  const [clickedSection, setClickedSection] = useState<string | undefined>(undefined);
  const memberDetailsRef = useRef<HTMLDivElement>(null);
  const { width } = useScreenSize();

  const alumniRoles = populateMembers(teamRoles as RoleEntry, alumniMembers as IdolMember[]);
  const orderedAlumni = Object.keys(alumniRoles).reduce(
    (acc: IdolMember[], role) =>
      acc.concat(alumniRoles[role].members.filter((member) => !acc.includes(member))),
    []
  );
  const getColumnCount = (): number => {
    if (width < TABLET_BREAKPOINT) return PHONE_COLUMNS;
    if (width < LAPTOP_BREAKPOINT) return TABLET_COLUMNS;
    return LAPTOP_COLUMNS;
  };

  const canInsertMemberDetails = (
    index: number,
    members: IdolMember[],
    roleName: string,
    selectedMemberIndex: number
  ): boolean => {
    let columns = getColumnCount();

    if (selectedMember === undefined) return false;
    if (roleName !== selectedRole && selectedRole !== 'Full Team') return false;
    if (clickedSection !== roleName) return false;

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

  const handleMemberClick = (member: IdolMember, roleName: string) => {
    const newMember = member.netid === selectedMember?.netid ? undefined : member;
    setSelectedMember(newMember);
    setClickedSection(newMember ? roleName : undefined);

    if (newMember && member.netid !== selectedMember?.netid) {
      requestAnimationFrame(() =>
        memberDetailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      );
    }
  };

  const handleCloseDetails = () => {
    setSelectedMember(undefined);
    setClickedSection(undefined);
  };

  const BoxBorder = ({
    columnCount,
    showCloseButton = false,
    onClose
  }: {
    columnCount: number;
    showCloseButton?: boolean;
    onClose?: () => void;
  }) => {
    const totalBoxes = columnCount * 4;

    return (
      <div className={`grid`} style={{ gridTemplateColumns: `repeat(${totalBoxes}, 1fr)` }}>
        {Array.from({ length: totalBoxes }, (_, index) => {
          const isLastBox = index === totalBoxes - 1;
          const shouldShowCloseButton = showCloseButton && isLastBox;

          return (
            <div
              key={index}
              className={`aspect-square relative border-r border-b border-border-1 ${
                isLastBox ? 'border-r-0' : ''
              }`}
            >
              {shouldShowCloseButton && onClose && (
                <IconButton
                  aria-label="Close member details"
                  onClick={onClose}
                  variant="tertiary"
                  className="absolute w-full h-full border-0 rounded-none"
                >
                  <XIcon size={24} />
                </IconButton>
              )}
            </div>
          );
        })}
      </div>
    );
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
    const columns = getColumnCount();
    const items = [];
    const {
      isAlumni = false,
      roleName = '',
      selectedMember,
      selectedMemberIndex = -1,
      onMemberClick,
      memberDetailsRef
    } = options;

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const isSelected = selectedMember?.netid === member.netid;

      items.push(
        <div
          key={member.netid}
          className={`relative border-r border-border-1 ${(i + 1) % columns === 0 ? 'border-r-0' : ''}`}
        >
          {isAlumni ? (
            <a
              href={member.linkedin || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <MemberCard
                user={member}
                image={`/team/teamHeadshots/${member.netid}.jpg`}
                selected={false}
              />
            </a>
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
      for (let i = 0; i < fillers; i++) {
        items.push(
          <div
            key={`filler-${isAlumni ? 'alumni-' : ''}${i}`}
            className={`border-r border-b border-border-1 ${i === fillers - 1 ? 'border-r-0' : ''}`}
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
            <BoxBorder
              columnCount={getColumnCount()}
              showCloseButton={true}
              onClose={handleCloseDetails}
            />
            <MemberDetailsCard
              user={selectedMember}
              image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
            />
            <BoxBorder columnCount={getColumnCount()} />
          </div>
        );

        items.splice(adjustedInsertIndex + 1, 0, detailsComponent);
      }
    }

    return items;
  };

  return (
    <section>
      <div className="flex flex-col pt-8 pb-8 p-4 md:p-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="">Introducing the team</h2>
          <p className="text-foreground-3">
            Learn more about the team at DTI and what we do behind the scenes. Our design,
            development, business, and product teams all strive to use creativity and innovation to
            make DTI's products more impactful and functional.
          </p>
        </div>
        <div className="grid md:grid-cols-6 grid-cols-3 border border-border-1 rounded-md md:rounded-full">
          {roleIcons.icons.map((role) => {
            const isSelected = selectedRole === role.altText;

            return (
              <button
                key={role.altText}
                onClick={() => {
                  setSelectedRole(role.altText);
                  setSelectedMember(undefined);
                  setClickedSection(undefined);
                }}
                aria-label={`Select ${role.altText} role`}
                className={`flex flex-col md:flex-row items-center justify-center pl-6 pr-6 pb-2 pt-2 gap-2 rounded-md md:rounded-full min-h-[48px] focusState
                                    ${isSelected ? 'bg-background-2' : 'hover:bg-background-2'}`}
              >
                <img
                  src={`${role.src}.svg`}
                  alt={`${role.altText} icon`}
                  width={role.width}
                  height={role.height}
                />
                <p>{role.altText}</p>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col md:gap-32 gap-16">
        {Object.keys(roles).map((roleKey) => {
          const roleData = roles[roleKey];
          const shouldShow = selectedRole === roleData.roleName || selectedRole === 'Full Team';

          if (!shouldShow) return null;

          const selectedMemberIndex = selectedMember
            ? roleData.members.findIndex((member) => member.netid === selectedMember.netid)
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
        })}

        {/* Alumni Section */}
        {selectedRole === 'Full Team' && (
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
    </section>
  );
}
