import { ReactElement, ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { IconButton } from '../Button/Button';
import { XIcon } from '../../icons';
import { useDesignSystemTheme } from '../Theme/Theme';
import styles from './Modal.module.css';

export type ModalProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
};
export const ModalClose = Dialog.Close;
export const ModalBackdrop = Dialog.Backdrop;
/** Base UI owns focus trapping, restoration, Escape, outside press, and scroll locking. */
export function Modal({
  id,
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer
}: ModalProps): JSX.Element {
  const theme = useDesignSystemTheme();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal data-idol-redesign data-idol-theme={theme} className={styles.portal}>
        <ModalBackdrop className={styles.backdrop} />
        <Dialog.Viewport className={styles.viewport}>
          <Dialog.Popup id={id} className={styles.modal}>
            <div className={styles.surface}>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              {description && (
                <Dialog.Description className={styles.description}>
                  {description}
                </Dialog.Description>
              )}
              <div className={styles.content}>{children}</div>
              <ModalClose
                render={
                  <IconButton
                    aria-label="Close modal"
                    variant="tertiary"
                    size={24}
                    icon={<XIcon size={16} aria-hidden="true" />}
                    className={styles.close}
                  />
                }
              />
            </div>
            {footer && <div className={styles.footer}>{footer}</div>}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
