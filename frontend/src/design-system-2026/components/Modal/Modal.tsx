import { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { IconButton } from '../Button/Button';
import { XIcon } from '../../icons';
import { useDesignSystemAppearance } from '../Theme/Theme';
import styles from './Modal.module.css';

export type ModalProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactElement;
  title: string;
  description?: string;
  width?: number;
  children?: ReactNode;
  footer?: ReactNode;
  surfaceClassName?: string;
  surfaceOverlay?: ReactNode;
  popupProps?: Pick<
    HTMLAttributes<HTMLDivElement>,
    'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
  >;
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
  width,
  children,
  footer,
  surfaceClassName = '',
  surfaceOverlay,
  popupProps
}: ModalProps): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal
        data-idol-redesign
        data-idol-theme={theme}
        data-idol-accent={accent}
        className={styles.portal}
      >
        <ModalBackdrop className={styles.backdrop} />
        <Dialog.Viewport className={styles.viewport}>
          <Dialog.Popup
            {...popupProps}
            id={id}
            className={styles.modal}
            style={width ? { width } : undefined}
          >
            <div className={`${styles.surface} ${surfaceClassName}`}>
              {surfaceOverlay}
              <div className={styles.heading}>
                <Dialog.Title className={styles.title}>{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className={styles.description}>
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <div className={styles.content}>{children}</div>
              <ModalClose
                render={
                  <IconButton
                    aria-label="Close modal"
                    variant="tertiary"
                    size={36}
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
