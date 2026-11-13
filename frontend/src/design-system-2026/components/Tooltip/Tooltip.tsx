import { ReactElement, ReactNode } from 'react';
import { Popover } from '@base-ui/react/popover';
import { useDesignSystemAppearance } from '../Theme/Theme';
import styles from './Tooltip.module.css';

export type TooltipProps = {
  /** The element that opens the tooltip; it must accept a ref and forward props (e.g. IconButton). */
  trigger: ReactElement;
  content: ReactNode;
  side?: Popover.Positioner.Props['side'];
  align?: Popover.Positioner.Props['align'];
  /** Milliseconds of hover before opening. */
  delay?: number;
};

/**
 * Opens on hover for pointers and on click/tap for touch and keyboard users. Built on Base UI's
 * Popover (not Tooltip) because Base UI tooltips never open on touch.
 */
export function Tooltip({
  trigger,
  content,
  side = 'top',
  align = 'center',
  delay = 200
}: TooltipProps): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  return (
    <Popover.Root>
      <Popover.Trigger openOnHover delay={delay} closeDelay={0} render={trigger} />
      <Popover.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
        <Popover.Positioner
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={16}
          className={styles.positioner}
        >
          {/* Keep focus on the trigger: the tooltip has nothing interactive to focus. */}
          <Popover.Popup initialFocus={false} className={styles.popup}>
            {content}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
