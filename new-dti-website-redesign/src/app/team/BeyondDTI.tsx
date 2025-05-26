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
  'goldman-sachs',
  'y-combinator',
  'uber',
  'amazon',
  'mckinsey-&-company',
  'capital-one',
  'mongodb',
  'datadog'
];

export default function BeyondDTI() {
  // On desktop, splits into 6 columns
  // 4 companies in first and last 2 columns
  // 2 companies in 2 middle columns
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
      <div
        key={filename}
        className="flex justify-center items-center max-[660px]:w-[35%] max-[500px]:w-[49%]"
      >
        <Image
          width={150}
          height={64}
          src={`/team/companies/${filename}.svg`}
          alt={`${filename} logo`}
        />
      </div>
    ));

  const colCss =
    'flex flex-1 flex-row min-[1000px]:flex-col gap-1 md:gap-8 justify-between flex-wrap';

  return (
    <section className="flex flex-col min-[1000px]:flex-row relative p-4 md:p-8 gap-8">
      {/* first 3 columns */}
      {cols.slice(0, 3).map((col, idx) => (
        <div key={idx} className={colCss}>
          {renderImages(col)}
        </div>
      ))}

      {/* text container placed between cols 3 and 4 */}
      <div
        className="flex flex-col gap-2 items-center
      min-[630px]:absolute min-[630px]:top-1/2 min-[630px]:left-1/2
      min-[630px]:-translate-x-1/2 min-[630px]:-translate-y-1/2
      min-[630px]:max-w-[320px]"
      >
        <h2 className="h3">Beyond DTI</h2>
        <p className="text-foreground-3 text-center">
          Our members and alumni are all over the world, but here are just a few places you&#39;ll
          find the DTI family continue their success into industry.
        </p>
      </div>

      {/* last 3 columns */}
      {cols.slice(3).map((col, idx) => (
        <div key={idx + 3} className={colCss}>
          {renderImages(col)}
        </div>
      ))}
    </section>
  );
}
