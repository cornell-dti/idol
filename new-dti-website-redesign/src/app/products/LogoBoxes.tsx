'use client';

import React from 'react';
import LogoBox from '../../components/LogoBox';
import logos from './logos.json';

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
          outerLinkClassName={
            index === 0 ? 'onFocusRounded-t-l' : index === 3 ? 'onFocusRounded-t-r' : ''
          }
        />
      ))}
    </section>
  );
}
