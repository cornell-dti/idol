import React from 'react';
import useScrollPosition from '../../src/hooks/useScrollPosition';

interface BannerProps {
  message: string;
  variant?: 'info' | 'alert' | 'success';
  className?: string;
  navbarHeight?: number;
}

const variantStyles: Record<NonNullable<BannerProps['variant']>, string> = {
  info: 'bg-neutral-800',
  alert: 'bg-red-700',
  success: 'bg-black border-b-2 border-t-2 border-t-neutral-800 border-b-neutral-800'
};

export default function Banner({
  message,
  variant = 'info',
  className = '',
  navbarHeight = 130
}: BannerProps) {
  const { scrollY } = useScrollPosition();

  const isFixed = scrollY > navbarHeight;

  const variantClass = variantStyles[variant] || '';

  return (
    <div
      className={`${
        isFixed ? 'fixed' : 'absolute'
      } top-0 left-0 w-full text-white text-center text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl px-6 py-4 z-50 ${variantClass} ${className}`}
    >
      {message}
    </div>
  );
}
