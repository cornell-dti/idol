'use client';

import React, { useEffect, useState } from 'react';
import colors from './colors';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import CopyIcon from '@/components/icons/CopyIcon';
import CheckIcon from '@/components/icons/CheckIcon';

interface ColorCardProps {
  color: string;
  name: string;
}

function ColorCard({ color, name }: ColorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (color) {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <article className="flex-1 rounded-lg border border-border-1 flex flex-col overflow-clip">
      <div className="h-32 w-full" style={{ backgroundColor: color }}></div>
      <div className="flex p-3 flex-col border-t-1 border-border-1">
        <h3 className="h6">{name}</h3>
        <div className="flex items-center gap-2 justify-between">
          <p className="text-foreground-3">{color}</p>
          <button
            onClick={handleCopy}
            className="w-9 h-9 flex items-center justify-center cursor-pointer p-2 focusState rounded-sm group"
            type="button"
            aria-label={`Copy ${name} color`}
          >
            {copied ? (
              <CheckIcon
                size={20}
                className="group-hover:stroke-foreground-1 transition-all duration-120"
              />
            ) : (
              <CopyIcon
                size={20}
                color="foreground-3"
                className="group-hover:stroke-foreground-1 transition-all duration-120"
              />
            )}
          </button>
        </div>
      </div>
    </article>
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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ name, variable }) => (
              <ColorCard key={name} name={name} color={resolvedColors[variable]} />
            ))}
          </div>
        </PageSection>
      ))}
    </PageLayout>
  );
}
