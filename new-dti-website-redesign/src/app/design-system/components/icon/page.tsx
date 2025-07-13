import React from 'react';
import PageLayout from '../../util/PageLayout';
import icons from './icons';
import Note from '../../util/Note';
import Link from 'next/link';
import OpenIcon from '@/components/icons/OpenIcon';

export default function IconPage() {
  return (
    <PageLayout title="Icon">
      <div className="p-6 md:p-12 border-x-1 border-b-1 border-border-1">
        <Note
          inner={
            <p>
              Icons come from{' '}
              <Link
                href={'https://lucide.dev/'}
                target="_blank"
                className="underline underline-offset-3"
              >
                <span>Lucide</span>
                <OpenIcon size={20} className="inline ml-1 mb-1" />
              </Link>
              .
            </p>
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 border-l border-border-1">
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
