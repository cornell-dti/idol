import { AnchorHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { CaretRightIcon } from '../../icons';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbItemProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  icon?: ReactNode;
} & ({ current: true; href?: never } | { current?: false; href: string });

export function BreadcrumbItem({
  icon,
  children,
  current,
  href,
  className = '',
  ...props
}: BreadcrumbItemProps): JSX.Element {
  const content = (
    <>
      {icon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );
  if (current)
    return (
      <span
        aria-current="page"
        className={`${styles.breadcrumbItem} ${styles.currentCrumb} ${className}`}
      >
        {content}
      </span>
    );
  return (
    <Link href={href as string}>
      <a {...props} className={`${styles.breadcrumbItem} ${className}`}>
        {content}
      </a>
    </Link>
  );
}

export type Breadcrumb = { id: string; label: ReactNode; href: string; icon?: ReactNode };
export function Breadcrumbs({
  items,
  label = 'Breadcrumb'
}: {
  readonly items: readonly Breadcrumb[];
  readonly label?: string;
}): JSX.Element {
  return (
    <nav aria-label={label}>
      <ol className={styles.breadcrumbs}>
        {items.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <CaretRightIcon size={16} aria-hidden="true" />}
            {index === items.length - 1 ? (
              <BreadcrumbItem current icon={item.icon}>
                {item.label}
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem href={item.href} icon={item.icon}>
                {item.label}
              </BreadcrumbItem>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
