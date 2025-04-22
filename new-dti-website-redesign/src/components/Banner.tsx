import React, { ReactNode } from 'react';
import Button from './Button';

type Props = {
  label: string;
};

const Banner = ({ label }: Props): ReactNode => (
  <div className="px-5 py-3 flex items-center rounded-full border-1 border-border-1-transparent bg-background-3-transparent backdrop-blur-[32px] sticky z-10 top-4 m-auto w-fit mb-8">
    <p>{label}</p>
  </div>
);

export default Banner;
