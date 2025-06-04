'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  label: string;
};

function Banner({ label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`flex items-center justify-center sticky transition-all z-40 md:pt-4 md:mt-[-67px] w-fit mx-auto duration-600
      ${visible ? 'top-[72px]' : 'top-[-100px]'}
    `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.47, 0, 0.23, 1.38)'
      }}
    >
      <div
        className="
        px-5 py-4 md:py-3 text-center w-full md:w-fit
        border-t-1 border-b-1 border-t-border-1 border-b-border-1
        md:border-1 md:border-border-1-transparent
        md:rounded-full
        bg-background-2 md:bg-background-3-transparent
        backdrop-blur-[32px] md:mx-auto
      "
      >
        <p>{label}</p>
      </div>
    </div>
  );
}

export default Banner;
