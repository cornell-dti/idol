import React from 'react';

interface BannerProps {
  message: string;
  variant?: 'default' | 'accent' | 'outlined';
  className?: string;
  navbarHeight?: number;
  link?: string;
}

const variantStyles: Record<NonNullable<BannerProps['variant']>, string> = {
  default: 'bg-neutral-800',
  accent: 'bg-red-700',
  outlined: 'bg-black border-b-2 border-t-2 border-t-neutral-800 border-b-neutral-800'
};

/**
 * `Banner` Component - Displays a customizable banner at the top of the page.
 *
 * @remarks
 * The `Banner` component shows a message in a banner that can be styled and positioned
 * based on the user's scroll position. It supports three variants (`default`, `accent`, and `outlined`), which can be modified
 * (I just used these variant names because they're the most common banner usages),
 * and allows additional customizations via className.
 *
 * @param props - Contains:
 *   - `message` (string): The message to be displayed in the banner. *(Required)*
 *   - `variant` (`'default' | 'accent' | 'outlined'`, optional): Specifies the banner's style. Defaults to `'default'`.
 *   - `className` (string, optional): Additional classes for custom styling. Defaults to an empty string. This has priority over the
 *     className so you can customize it to your liking.
 *   - `navbarHeight` (number, optional): The height of the navbar. Determines when the banner becomes fixed.
 *     Defaults to `130` for the current navbar.
 *   - `link` (string, optional): If provided, wraps the banner in an anchor tag.
 */
export default function Banner({
  message,
  variant = 'default',
  className = '',
  navbarHeight = 130,
  link
}: BannerProps) {
  const variantClass = variantStyles[variant] || '';
  const hoverClass = link ? 'hover:bg-red-800' : '';

  const bannerContent = (
    <div
      className={`absolute top-0 left-0 w-full text-white text-center text-[20px] px-6 py-4 z-50 ${variantClass} ${className} ${hoverClass}`}
    >
      {message}
    </div>
  );

  return link ? (
    <a href={link} target="_blank">
      {bannerContent}
    </a>
  ) : (
    bannerContent
  );
}
