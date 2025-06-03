'use client';

import React from 'react';
import LogoBox from '../../components/LogoBox';
import logos from './logos.json';

const getOuterLinkClassName = (index: number) => {
  if (index === 0) return 'onFocusRounded-t-l';
  if (index === 3) return 'onFocusRounded-t-r';
  return '';
};

export default function LogoGrid() {
  return (
    <section className="grid grid-cols-4 border-border-1 border-t-1">
      {logos.map((logo, index) => (
        <LogoBox
          key={index}
          {...logo}
          fillWidth
          ariaLabel={`Jump to ${logo.alt.replace(/ logo$/i, '')} product`}
          className={`border-l border-border-1 
            ${index === 0 || index === 4 ? '!border-l-0' : ''}
            ${index >= 4 && index <= 8 ? '!border-b-0' : ''}
          `}
          outerLinkClassName={getOuterLinkClassName(index)}
        />
      ))}
    </section>
  );
}
