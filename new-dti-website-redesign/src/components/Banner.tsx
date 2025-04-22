import React, { ReactNode } from 'react';

type Props = {
  label: string;
  type?: 'flushed' | 'pill';
};

const Banner = ({ label, type }: Props): ReactNode => {
  if (type === 'pill') {
    return (
      <div className="flex items-center sticky top-0 z-10 pt-4 remove-next-section-outline">
        <div className="px-5 py-3  rounded-full border-1 border-border-1-transparent bg-background-3-transparent backdrop-blur-[32px]  mx-auto w-fit">
          <p>{label}</p>
        </div>
      </div>
    );
  }

  // flushed or undefined
  return (
    <div className="p-6 sticky top-0 bg-background-2 border-t border-b border-border-1 flex items-center justify-center z-10 w-full">
      <p>{label}</p>
    </div>
  );
};

export default Banner;
