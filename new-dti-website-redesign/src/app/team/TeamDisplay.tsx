'use client';

import { useState } from 'react';
import members from './data/all-members.json';
import teamRoles from './data/roles.json';
import roleIcons from './data/roleIcons.json';
import alumniMembers from './data/alumni.json';

export default function TeamDisplay() {
  const [selectedRole, setSelectedRole] = useState<string>('Full Team');

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
        <div className="grid md:grid-cols-6 grid-cols-3 border border-[var(--color-border-1)] rounded-md md:rounded-full">
          {roleIcons.icons.map((role) => {
            const isSelected = selectedRole === role.altText;

            return (
              <button
                key={role.altText}
                onClick={() => setSelectedRole(role.altText)}
                aria-label={`Select ${role.altText} role`}
                className={`flex flex-col md:flex-row items-center justify-center pl-6 pr-6 pb-2 pt-2 gap-2 rounded-md md:rounded-full min-h-[48px]
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
    </section>
  );
}
