import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import layouts from './layouts';
import Image from 'next/image';

function getContentWidth(width: number) {
  if (width >= 1800) return 1544; // 128px padding
  if (width >= 1440) return 1184; // 128px padding
  if (width >= 768) return 704; // 32px padding
  return 448; // 16px padding
}

type LayoutSectionProps = {
  title: string;
  width: number;
  height: number;
  lines: number;
  description: string;
  image: string;
  alt: string;
};
function LayoutSection({
  title,
  width,
  height,
  lines,
  description,
  image,
  alt
}: LayoutSectionProps) {
  return (
    <PageSection title={title} description={description} className="overflow-x-scroll">
      <Image src={image} alt={alt} width={width} height={height} />
    </PageSection>
  );
}

export default function Layout() {
  return (
    <PageLayout title="Layout" className="overflow-hidden">
      {layouts.map((config) => (
        <LayoutSection key={config.title} {...config} />
      ))}
    </PageLayout>
  );
}
