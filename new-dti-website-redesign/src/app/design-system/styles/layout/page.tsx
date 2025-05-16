import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import layouts from './layouts';

type LayoutSectionProps = {
  title: string;
  width: number;
  height: number;
  lines: number;
};
function LayoutSection({ title, width, height, lines }: LayoutSectionProps) {
  // Additional styling based on width of mocked up layout
  const containerClasses =
    width >= 1800
      ? 'flex items-center'
      : width >= 768 && width < 1400
        ? 'px-8 flex justify-between'
        : width < 768
          ? 'px-4 flex justify-between'
          : '';

  // Decide if inner wrapper is needed (for large desktop layouts where content is centered)
  const shouldUseInnerWrapper = width >= 1400;

  // Blue vertical lines demonstrating the grid alignment
  const linesMarkup = Array.from({ length: lines }).map((_, idx) => (
    <div key={idx} className="w-[1px] h-full bg-accent-blue" />
  ));

  return (
    <PageSection title={title} className="overflow-x-scroll">
      <div
        className={`bg-background-2 border-1 border-border-1 rounded-lg ${containerClasses}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {shouldUseInnerWrapper ? (
          <div className="flex justify-between max-w-[1184px] h-full w-full m-auto">
            {linesMarkup}
          </div>
        ) : (
          linesMarkup
        )}
      </div>
    </PageSection>
  );
}

export default function Layout() {
  return (
    <PageLayout title="Layout" description="Guidelines for layout." className="overflow-hidden">
      {layouts.map((config) => (
        <LayoutSection key={config.title} {...config} />
      ))}
    </PageLayout>
  );
}
