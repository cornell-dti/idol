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

/**
 * `Banner` Component - Displays a customizable banner at the top of the page.
 *
 * @remarks
 * The `Banner` component shows a message in a banner that can be styled and positioned
 * based on the user's scroll position. It supports three variants (`info`, `alert`, and `success`), which can be modified
 * (I just used these variant names because they're the most common banner usages),
 * and allows additional customizations via className.
 *
 * @param props - Contains:
 *   - `message` (string): The message to be displayed in the banner. *(Required)*
 *   - `variant` (`'info' | 'alert' | 'success'`, optional): Specifies the banner's style. Defaults to `'info'`.
 *   - `className` (string, optional): Additional classes for custom styling. Defaults to an empty string. This has priority over the
 *     className so you can customizse it to your liking.
 *   - `navbarHeight` (number, optional): The height of the navbar. Determines when the banner becomes fixed.
 *     Defaults to `130` for the current navbar.
 */
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
