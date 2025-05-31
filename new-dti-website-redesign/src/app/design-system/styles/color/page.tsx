'use client';

import React, { useEffect, useState } from 'react';
import colors from './colors';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';

interface ColorCardProps {
  color: string;
  name: string;
}

function ColorCard({ color, name }: ColorCardProps) {
  return (
    <div className="flex-1 max-w-[260px] rounded-lg border border-border-1 flex flex-col overflow-clip">
      <div className="h-32 w-full" style={{ backgroundColor: color }}></div>
      <div className="flex p-4 flex-col border-t-1 border-border-1">
        <p>{name}</p>
        <p className="text-foreground-3">{color}</p>
      </div>
    </div>
  );
}

export default function ColorPage() {
  const [resolvedColors, setResolvedColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const newColors: Record<string, string> = {};
    colors.forEach(({ variable }) => {
      newColors[variable] = styles.getPropertyValue(variable).trim();
    });
    setResolvedColors(newColors);
  }, []);

  const grouped = colors.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, typeof colors>
  );

  return (
    <PageLayout title="Color" description="Description of color.">
      {Object.entries(grouped).map(([type, items]) => (
        <PageSection key={type} title={type} description="">
          <div className="flex gap-6">
            {items.map(({ name, variable }) => (
              <ColorCard key={name} name={name} color={resolvedColors[variable]} />
            ))}
          </div>
        </PageSection>
      ))}
    </PageLayout>
  );
}
