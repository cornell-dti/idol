import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  devMode?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  className = '',
  devMode = false
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`max-w-[1200px] mx-auto px-4 py-8 ${className} ${
        devMode ? 'border border-blue-500' : ''
      }`}
    >
      {children}
    </section>
  );
}
