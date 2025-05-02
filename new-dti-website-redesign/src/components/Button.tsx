'use client';

import Link from 'next/link';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  badge?: React.ReactNode;
  backToTop?: React.ReactNode;
};

export default function Button({
  label,
  onClick,
  href,
  className = '',
  variant = 'primary',
  badge,
  backToTop
}: ButtonProps) {
  const baseStyles = `
    px-6 h-12 w-fit rounded-full cursor-pointer inline-flex items-center justify-center gap-2
    transition-[background-color] duration-[120ms] focusState text-nowrap`;

  const variantStyles = {
    primary: `bg-foreground-1 text-background-1 hover:bg-foreground-2 ${badge ? 'gap-1 pr-3' : ''}`,
    secondary: `bg-background-2 border border-border-1 text-foreground-1 hover:bg-background-3`,
    tertiary: `bg-transparent border border-border-1 text-foreground-1 hover:bg-background-2`
  }[variant];

  const sharedClasses = `${baseStyles} ${variantStyles} ${className}`;

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
      <Link href={href} className={sharedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={sharedClasses} type="button">
      {content}
    </button>
  );
}
