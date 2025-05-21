import React, { ReactNode } from 'react';

type Props = {
  label: string;
};

const Banner = ({ label }: Props): ReactNode => (
  <div className="flex items-center justify-center sticky top-20 z-20 min-[1200px]:pt-4 min-[1200px]:mt-[-67px]">
    <div
      className="
        px-5 py-4 md:py-3 text-center w-full min-[1200px]:w-fit
        border-t-1 border-b-1 border-t-border-1 border-b-border-1
        min-[1200px]:border-t min-[1200px]:border-b min-[1200px]:border-border-1-transparent
        min-[1200px]:rounded-full
        bg-background-2 min-[1200px]:bg-background-3-transparent
        backdrop-blur-[32px] min-[1200px]:mx-auto
      "
    >
      <p>{label}</p>
    </div>
  </div>
);

export default Banner;
