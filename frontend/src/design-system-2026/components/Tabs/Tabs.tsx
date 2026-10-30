import { forwardRef, ReactNode } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import styles from './Tabs.module.css';

export type TabProps = Omit<BaseTabs.Tab.Props, 'className'> & {
  className?: string;
  icon?: ReactNode;
};
export const Tab = forwardRef<HTMLElement, TabProps>(
  ({ icon, children, className = '', ...props }, ref) => (
    <BaseTabs.Tab {...props} ref={ref} className={`${styles.tab} ${className}`}>
      {icon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </BaseTabs.Tab>
  )
);
export const TabRoot = BaseTabs.Root;
export const TabList = forwardRef<
  HTMLDivElement,
  Omit<BaseTabs.List.Props, 'className' | 'children'> & {
    className?: string;
    children?: ReactNode;
  }
>(({ className = '', children, ...props }, ref) => (
  <BaseTabs.List {...props} ref={ref} className={`${styles.tabTrack} ${className}`}>
    {children}
    <BaseTabs.Indicator className={styles.tabIndicator} aria-hidden="true" />
  </BaseTabs.List>
));
export const TabPanel = BaseTabs.Panel;
export type TabItem = {
  value: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};
export type TabsProps = {
  id: string;
  label: string;
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
};
export function Tabs({ id, label, items, value, onValueChange }: TabsProps): JSX.Element {
  return (
    <BaseTabs.Root
      id={id}
      value={value}
      onValueChange={onValueChange}
      className={styles.tabsContainer}
    >
      <TabList aria-label={label} className={styles.tabList} activateOnFocus>
        {items.map((item) => (
          <Tab key={item.value} value={item.value} disabled={item.disabled} icon={item.icon}>
            {item.label}
          </Tab>
        ))}
      </TabList>
      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} className={styles.tabPanel}>
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
