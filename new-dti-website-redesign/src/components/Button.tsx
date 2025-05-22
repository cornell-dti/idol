'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

export const baseStyles = `w-fit rounded-full cursor-pointer inline-flex items-center justify-center gap-2 transition-[background-color] duration-[120ms] focusState text-nowrap`;

type ButtonProps = {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'default' | 'small';
  badge?: React.ReactNode;
  backToTop?: React.ReactNode;
  newTab?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick'>;
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      label,
      onClick,
      href,
      className = '',
      variant = 'primary',
      size = 'default',
      badge,
      backToTop,
      newTab = false,
      ...rest
    },
    ref
  ) => {
    const variantStyles = {
      primary: `bg-foreground-1 text-background-1 hover:bg-foreground-2 ${
        badge ? 'gap-1 pr-3' : ''
      }`,
      secondary: `bg-background-2 border border-border-1 text-foreground-1 hover:bg-background-3`,
      tertiary: `bg-transparent border border-border-1 text-foreground-1 hover:bg-background-2`
    }[variant];

    const sizeStyles = {
      default: 'px-6 h-12',
      small: 'px-4 h-10'
    }[size];

    const sharedClasses = `${baseStyles} ${className} ${variantStyles} ${sizeStyles}`;

    const content = (
      <>
        {backToTop && <span>{backToTop}</span>}
        <span className="text-rg font-medium">{label}</span>
        {badge && (
          <span className="p-2 bg-[#0000001a] text-background-1 rounded-full text-xs font-medium uppercase tracking-wider">
            {badge}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          onClick={onClick}
          className={sharedClasses}
          target={newTab ? '_blank' : undefined}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className={sharedClasses}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
