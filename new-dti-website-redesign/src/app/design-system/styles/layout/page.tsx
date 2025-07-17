import React from 'react';
import Image from 'next/image';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import layouts from './layouts';
import Note from '../../util/Note';

type LayoutSectionProps = {
  title: string;
  width: number;
  height: number;
  lines: number;
  description: string;
  image: string;
  alt: string;
  note?: React.ReactNode;
};

function LayoutSection({
  title,
  width,
  height,
  lines,
  description,
  image,
  alt,
  note
}: LayoutSectionProps) {
  return (
    <PageSection title={title} description={description} className="overflow-x-scroll">
      {note}
      <Image src={image} alt={alt} width={width} height={height} />
    </PageSection>
  );
}

export default function Layout() {
  return (
    <PageLayout title="Layout" className="overflow-hidden">
      {layouts.map((config, index) => (
        <LayoutSection
          key={config.title}
          {...config}
          note={
            index === 0 ? (
              <Note
                inner={
                  <p>
                    Inside the main layout (blue content), chilren should typically be aligned with
                    the grid lines. Exceptions are sometimes made for rows of 3 cards.
                  </p>
                }
              />
            ) : undefined
          }
        />
      ))}
    </PageLayout>
  );
}
