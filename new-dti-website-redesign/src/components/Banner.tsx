import React, { ReactNode } from 'react';

type Props = {
  label: string;
};

const Banner = ({ label }: Props): ReactNode => (
  <div className="flex items-center justify-center sticky top-[72px] z-20 md:pt-4 md:mt-[-67px] w-fit mx-auto">
    <div
      className="
        px-5 py-4 md:py-3 text-center w-full md:w-fit
        border-t-1 border-b-1 border-t-border-1 border-b-border-1
        md:border-t md:border-b md:border-border-1-transparent
        md:rounded-full
        bg-background-2 md:bg-background-3-transparent
        backdrop-blur-[32px] md:mx-auto
      "
    >
      <p>{label}</p>
    </div>
  </div>
);

export default Banner;
