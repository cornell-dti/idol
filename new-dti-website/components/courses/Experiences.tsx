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
      <div className="flex flex-col max-w-[450px]">
        <div className="flex flex-col items-start md:flex-row md:items-center">
          <Image
            src={icon}
            width={150}
            height={150}
            alt={icon}
            unoptimized
            className="w-24 md:w-[35%]"
          />
          <div className="lg:text-text-6xl xs:text-4xl font-extrabold">{title}</div>
        </div>
        <div className="md:text-2xl xs:text-2xl mt-8">{description}</div>
      </div>
    </>
  );
}
