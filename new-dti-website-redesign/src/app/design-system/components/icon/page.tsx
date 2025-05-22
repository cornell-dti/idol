import React from 'react';
import PageLayout from '../../PageLayout';
import icons from './icons';

export default function IconPage() {
  return (
    <PageLayout title="Icon" description="Guidelines for icon component.">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {icons.map((icon, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 p-8 border-r-1 border-b-1 border-border-1 hover:bg-background-2 transition-colors duration-[120ms]"
          >
            {icon.svg}
            <p>{icon.label}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
