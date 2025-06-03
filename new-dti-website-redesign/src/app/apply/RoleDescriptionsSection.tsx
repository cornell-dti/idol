'use client';

import FancyTabs from '../../components/FancyTabs/FancyTabs';
import RoleDescriptionCard from './RoleDescriptionCard';
import roles from './roleDescriptions.json';

export default function RoleDescriptionsSection() {
  return (
    <section className="flex flex-col md:items-center">
      <div className="p-4 pb-8 sm:p-8">
        <h2>Role descriptions</h2>
      </div>

      <div className="md:p-8 !pt-0">
        <FancyTabs
          className="min-[940px]:w-200 w-full [&>div:last-child]:rounded-b-none md:[&>div:last-child]:rounded-b-2xl"
          tabs={roles.map((role, index) => ({
            icon: role.icon,
            label: role.role,
            content: (
              <RoleDescriptionCard
                key={index}
                role={role.role}
                skills={role.skills}
                responsibilities={role.responsibilities}
              />
            )
          }))}
        />
      </div>
    </section>
  );
}
