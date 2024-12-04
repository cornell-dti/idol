import React from 'react';
import Image from 'next/image';

interface IconProps {
  icon: string;
  title: string;
  description: string;
}

/**
 * `Experiences` Component - Displays key experiences for students in Trends :)
 *
 * @remarks
 * This component is used to highlight three core experiences students will get from Trends,
 * including best practices, deploying web applications, and completing a final project. Each experience consists
 * of an icon, a title, and a brief description. The component adapts its layout based on screen size, with responsive
 * text sizes and image scaling.
 *
 * @param props - Contains:
 *   - `icon`: The URL path to the icon image associated with the experience.
 *   - `title`: The title of the key experience.
 *   - `description`: A short description about the past student's projects.
 */
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
            className="w-24 md:w-[30%] -translate-x-2.5"
          />
          <h3 className="text-4xl font-bold">{title}</h3>
        </div>
        <div className="mt-8 md:text-lg">{description}</div>
      </div>
    </>
  );
}
