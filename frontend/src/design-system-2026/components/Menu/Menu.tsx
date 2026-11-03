import { forwardRef, ReactElement, ReactNode } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { useDesignSystemTheme } from '../Theme/Theme';
import styles from './Menu.module.css';

export type MenuProps = Pick<
  BaseMenu.Root.Props,
  'open' | 'defaultOpen' | 'onOpenChange' | 'disabled'
> & {
  trigger: ReactElement;
  children: ReactNode;
  align?: BaseMenu.Positioner.Props['align'];
  side?: BaseMenu.Positioner.Props['side'];
  'aria-label'?: string;
};

/** Base UI owns positioning, keyboard navigation, dismissal, and focus restoration. */
export function Menu({
  trigger,
  children,
  align = 'start',
  side = 'bottom',
  'aria-label': ariaLabel,
  ...props
}: MenuProps): JSX.Element {
  const theme = useDesignSystemTheme();
  return (
    <BaseMenu.Root {...props}>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal data-idol-redesign data-idol-theme={theme}>
        <BaseMenu.Positioner side={side} align={align} sideOffset={4} className={styles.positioner}>
          <BaseMenu.Popup aria-label={ariaLabel} className={styles.popup}>
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

export type MenuItemProps = Omit<BaseMenu.Item.Props, 'className'> & {
  className?: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
};
export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  ({ icon, variant = 'default', children, className = '', ...props }, ref) => (
    <BaseMenu.Item
      {...props}
      ref={ref}
      className={`${styles.item} ${variant === 'danger' ? styles.danger : ''} ${className}`}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </BaseMenu.Item>
  )
);

export function MenuGroup({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <BaseMenu.Group>
      <BaseMenu.GroupLabel className={styles.groupLabel}>{label}</BaseMenu.GroupLabel>
      {children}
    </BaseMenu.Group>
  );
}

export const MenuSeparator = forwardRef<
  HTMLDivElement,
  Omit<BaseMenu.Separator.Props, 'className'> & { className?: string }
>(({ className = '', ...props }, ref) => (
  <BaseMenu.Separator {...props} ref={ref} className={`${styles.separator} ${className}`} />
));
