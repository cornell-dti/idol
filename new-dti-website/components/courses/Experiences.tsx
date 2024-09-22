import React from 'react';
import Image from 'next/image';

interface IconProps {
  icon: string;
  title: string;
  description: string;
}

export default function Experiences({ icon, title, description }: IconProps) {
  return (
    <>
      <div className="flex flex-col max-w-[500px]">
        <div className="flex flex-col items-start md:flex-row md:items-center">
          <Image src={icon} width={150} height={150} alt={icon} unoptimized />
          <div className="lg:text-[40px] md:text-[30px] xs:text-5xl font-bold">{title}</div>
        </div>
        <div className="md:text-2xl xs:text-lg mt-8">{description}</div>
      </div>
    </>
  );
}
