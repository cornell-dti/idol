import { AnchorHTMLAttributes, forwardRef } from 'react';
import NextLink from 'next/link';
import styles from './Link.module.css';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, className = '', children, ...props }, ref) => (
    <NextLink href={href} passHref>
      <a {...props} href={href} ref={ref} className={`${styles.link} ${className}`}>
        {children}
      </a>
    </NextLink>
  )
);
