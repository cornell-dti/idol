import Image from 'next/image';
import React from 'react';

const companies = [
  'adobe',
  'ibm',
  'replit',
  'squarespace',
  'google',
  'microsoft',
  'roblox',
  'robinhood',
  'meta',
  'salesforce',
  'apple',
  'linkedin',
  'goldman',
  'yc',
  'uber',
  'amazon',
  'mckinsey',
  'capitalone',
  'mongodb',
  'datadog'
];

export default function BeyondDTI() {
  const cols = [
    companies.slice(0, 4),
    companies.slice(4, 8),
    companies.slice(8, 10),
    companies.slice(10, 12),
    companies.slice(12, 16),
    companies.slice(16, 20)
  ];

  const renderImages = (arr: (React.Key | null | undefined)[]) =>
    arr.map((filename: React.Key | null | undefined) => (
      <div className="flex justify-center items-center">
        <Image
          width={160}
          height={64}
          key={filename}
          src={`/team/companies/${filename}.svg`}
          alt={`${filename} logo`}
        />
      </div>
    ));

  return (
    <section>
      <div className="flex relative p-8 gap-8">
        {cols.map((col, idx) => {
          return (
            <div key={idx} className="flex flex-1 flex-col gap-8 justify-between">
              {renderImages(col)}
            </div>
          );
        })}

        <div className="flex flex-col gap-2 absolute items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[320px]">
          <h2 className="h3">Beyond DTI</h2>

          <p className="text-foreground-3 text-center">
            Our members and alumni are all over the world, but here are just a few places you'll
            find the DTI family continue their success into industry.
          </p>
        </div>
      </div>
    </section>
  );
}
