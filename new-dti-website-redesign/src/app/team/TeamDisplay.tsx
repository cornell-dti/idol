'use client';

import { useState, useRef } from 'react';
import members from './data/all-members.json';
import teamRoles from './data/roles.json';
import roleIcons from './data/roleIcons.json';
import alumniMembers from './data/alumni.json';
import { MemberCard, MemberDetailsCard } from '../../components/TeamCard';

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

  const alumniRoles = populateMembers(teamRoles as RoleEntry, alumniMembers as IdolMember[]);
  const orderedAlumni = Object.keys(alumniRoles).reduce(
    (acc: IdolMember[], role) =>
      acc.concat(alumniRoles[role].members.filter((member) => !acc.includes(member))),
    []
  );

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

  const handleOutsideClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.card-clickable') && !memberDetailsRef.current?.contains(target)) {
      setSelectedMember(undefined);
      setClickedSection(undefined);
    }
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
      <div className="flex flex-col md:gap-28 gap-16">
        {Object.keys(roles).map((roleKey) => {
          const roleData = roles[roleKey];
          const shouldShow = selectedRole === roleData.roleName || selectedRole === 'Full Team';

          if (!shouldShow) return null;

          return (
            <div key={roleKey} className="flex flex-col gap-4">
              <div className="flex flex-col md:p-8 p-4 gap-2 border-b-1 border-t-1 border-border-1">
                <h3>{`${roleData.roleName}${roleData.roleName !== 'Leads' ? '' : ' Team'}`}</h3>
                <p className="text-foreground-3">{roleData.description}</p>
              </div>

              {/* Members Grid */}
              <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-0">
                {roleData.members.map((member, memberIndex) => {
                  const isSelected = selectedMember?.netid === member.netid;

                  return (
                    <div key={member.netid} className="contents">
                      <MemberCard
                        user={member}
                        image={`/team/teamHeadshots/${member.netid}.jpg`}
                        selected={isSelected}
                        onClick={() => handleMemberClick(member, roleData.roleName)}
                        className="card-clickable"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Member Details - Show only for the clicked section */}
              {selectedMember && clickedSection === roleData.roleName && (
                <div className="mt-8">
                  <MemberDetailsCard
                    user={selectedMember}
                    image={`/team/teamHeadshots/${selectedMember.netid}.jpg`}
                    scrollRef={memberDetailsRef}
                  />
                  <button
                    onClick={handleCloseDetails}
                    className="mt-4 px-4 py-2 bg-background-2 rounded-md hover:bg-background-3 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Alumni Section */}
        {selectedRole === 'Full Team' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:p-8 p-4 gap-2">
              <h3>Alumni & Inactive Members</h3>
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-0">
              {orderedAlumni.map((member) => (
                <a
                  key={member.netid}
                  href={member.linkedin || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contents"
                >
                  <MemberCard
                    user={member}
                    image={`/team/teamHeadshots/${member.netid}.jpg`}
                    selected={false}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
