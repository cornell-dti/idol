'use client';

import React, { useEffect, useState } from 'react';
import colors from './colors';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import CopyIcon from '../../../../components/icons/CopyIcon';
import CheckIcon from '../../../../components/icons/CheckIcon';

interface ColorCardProps {
  color: string;
  name: string;
  description?: string;
}

function ColorCard({ color, name, description }: ColorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (color) {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <article className="flex-1 rounded-lg border border-border-1 flex flex-col overflow-clip designSystemCard">
      <div className="h-32 w-full" style={{ backgroundColor: color }}></div>
      <div className="flex p-3 flex-col gap-3 border-t-1 border-border-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 justify-between">
            <h3 className="h6">{name}</h3>
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
                  className="stroke-foreground-3 group-hover:stroke-foreground-1 transition-all duration-120"
                />
              )}
            </button>
          </div>

          {color && <p className="text-foreground-3 font-mono">{color.toUpperCase()}</p>}
        </div>

        {description && <p className="text-sm text-foreground-1">{description}</p>}
      </div>
    </article>
  );
}

export default function ColorPage() {
  const [resolvedColors, setResolvedColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const newColors: Record<string, string> = {};

    colors.forEach(({ items }) => {
      items.forEach(({ variable }) => {
        newColors[variable] = styles.getPropertyValue(variable).trim();
      });
    });

    setResolvedColors(newColors);
  }, []);

  return (
    <PageLayout title="Color">
      {colors.map(({ type, description, items }) => (
        <PageSection key={type} title={type} description={description}>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ name, variable, description: itemDescription }) => (
              <ColorCard
                key={name}
                name={name}
                color={resolvedColors[variable]}
                description={itemDescription}
              />
            ))}
          </div>
        </PageSection>
      ))}
    </PageLayout>
  );
}
