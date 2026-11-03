'use client';

import React from 'react';
import LogoBox from '../../components/LogoBox';
import { activeLogos } from './productData';

const visibleLogos = activeLogos.filter((logo) => logo.showOnProductPage !== false);
const lastRowStart = Math.floor((visibleLogos.length - 1) / 4) * 4;
const lastRowSpan = ['sm:col-span-12', 'sm:col-span-6', 'sm:col-span-4', 'sm:col-span-3'][
  (visibleLogos.length % 4 || 4) - 1
];

export default function LogoGrid() {
  return (
    <section
      aria-label="Active product logos"
      className="grid grid-cols-2 sm:grid-cols-12 gap-px bg-border-1 border-border-1 border-t-1 overflow-hidden"
    >
      {visibleLogos.map((logo, index) => (
        <LogoBox
          key={logo.href}
          {...logo}
          fillWidth
          border={false}
          ariaLabel={`Jump to ${logo.alt.replace(/ logo$/i, '')} product`}
          outerLinkClassName={`bg-background-1 ${
            index >= lastRowStart ? lastRowSpan : 'sm:col-span-3'
          } ${
            visibleLogos.length % 2 === 1 && index === visibleLogos.length - 1 ? 'col-span-2' : ''
          }`}
        />
      ))}
    </section>
  );
}
