'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type IconButtonProps = {
  'aria-label': string;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: ReactNode;
};

export default function IconButton({
  'aria-label': ariaLabel,
  onClick,
  href,
  className = '',
  variant = 'primary',
  children
}: IconButtonProps) {
  const baseStyles = `
    w-12 h-12 rounded-full cursor-pointer inline-flex items-center justify-center
    transition-[background-color] duration-[120ms] focusState`;

  const variantStyles = {
    primary: `bg-foreground-1 text-background-1 hover:bg-foreground-2`,
    secondary: `bg-background-2 border border-border-1 text-foreground-1 hover:bg-background-3`,
    tertiary: `bg-transparent border border-border-1 text-foreground-1 hover:bg-background-2`
  }[variant];

  const sharedClasses = `${baseStyles} ${variantStyles} ${className}`;

  const iconContent = <span className="w-6 h-6 flex items-center justify-center">{children}</span>;

  if (href) {
    return (
      <Link href={href} className={sharedClasses} aria-label={ariaLabel}>
        {iconContent}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={sharedClasses} aria-label={ariaLabel}>
      {iconContent}
    </button>
  );
}
