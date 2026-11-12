import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  DottedBackground,
  IconButton,
  Modal,
  Textarea
} from '../../../design-system-2026/components';
import { CheckIcon, PencilSimpleLineIcon, TrashIcon } from '../../../design-system-2026/icons';
import ImagesAPI from '../../../API/ImagesAPI';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import styles from './Shoutouts.module.css';

type DetailsProps = { shoutout: Shoutout; own: boolean; action?: ReactNode };

export function ShoutoutDetails({ shoutout, own, action }: DetailsProps): JSX.Element {
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const path = shoutout.images?.[0];
  useEffect(() => {
    let active = true;
    setImage('');
    setImageError(false);
    if (path)
      ImagesAPI.getImage(path)
        .then((url) => {
          if (active) setImage(url);
        })
        .catch(() => {
          if (active) setImageError(true);
        });
    return () => {
      active = false;
    };
  }, [path]);
  let from = `${shoutout.giver?.firstName ?? ''} ${shoutout.giver?.lastName ?? ''}`.trim();
  if (shoutout.isAnon) from = own ? 'Me (anonymous)' : 'Anonymous';
  else if (own) from = 'Me';
  return (
    <Card
      className={styles.shoutoutCard}
      header={
        <time dateTime={new Date(shoutout.timestamp).toISOString()}>
          {new Date(shoutout.timestamp).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
      }
      action={action}
    >
      <div className={styles.details}>
        <dl className={styles.people}>
          <div>
            <dt>To:</dt>
            <dd>{shoutout.receiver}</dd>
          </div>
          <div>
            <dt>From:</dt>
            <dd>{from || 'Unknown member'}</dd>
          </div>
        </dl>
        <div className={styles.message}>
          <h3>Shoutout</h3>
          <p>{shoutout.message}</p>
        </div>
        {Boolean(shoutout.tags?.length) && (
          <p className={styles.tagNames}>Tagged: {shoutout.tags?.join(', ')}</p>
        )}
        {path && (
          <div className={styles.imageSlot}>
            {imageError && <span>Image unavailable</span>}
            {!imageError && image && (
              <img
                src={image}
                width={64}
                height={64}
                alt={`Attachment for ${shoutout.receiver}`}
                onError={() => setImageError(true)}
              />
            )}
            {!imageError && !image && (
              <span
                role="status"
                aria-label="Loading picture"
                className={styles.imagePlaceholder}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

type Props = DetailsProps & {
  canManage: boolean;
  onUpdate: (shoutout: Shoutout) => void;
  onDelete: (uuid: string) => void;
};

export default function ShoutoutCard({
  shoutout,
  own,
  canManage,
  onUpdate,
  onDelete
}: Props): JSX.Element {
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);
  const [message, setMessage] = useState(shoutout.message);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const close = () => {
    if (!pending.current) {
      setMode(null);
      setError('');
      setMessage(shoutout.message);
    }
  };
  const open = (next: 'edit' | 'delete') => {
    setError('');
    setMessage(shoutout.message);
    setMode(next);
  };
  const save = async () => {
    if (pending.current) return;
    if (!message.trim()) {
      setError('Write a message for your shoutout.');
      return;
    }
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      const updated = { ...shoutout, message: message.trim() };
      const result = await ShoutoutsAPI.updateShoutout(shoutout.uuid, updated);
      if (!result || result.error) throw new Error(result?.error || 'Please try again.');
      onUpdate(result.shoutout ?? updated);
      setMode(null);
    } catch {
      setError('Couldn’t save your changes. Please try again.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  const remove = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      await ShoutoutsAPI.deleteShoutout(shoutout.uuid);
      setMode(null);
      onDelete(shoutout.uuid);
    } catch {
      setError('Couldn’t delete this shoutout. Please try again.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  return (
    <>
      <ShoutoutDetails
        shoutout={shoutout}
        own={own}
        action={
          canManage && (
            <div className={styles.cardActions}>
              <IconButton
                variant="tertiary"
                size={24}
                aria-label={`Edit shoutout to ${shoutout.receiver}`}
                icon={<PencilSimpleLineIcon size={16} />}
                onClick={() => open('edit')}
              />
              <IconButton
                variant="tertiary"
                size={24}
                aria-label={`Delete shoutout to ${shoutout.receiver}`}
                icon={<TrashIcon size={16} />}
                onClick={() => open('delete')}
              />
            </div>
          )
        }
      />
      <Modal
        id={`edit-shoutout-${shoutout.uuid}`}
        open={mode === 'edit'}
        onOpenChange={(isOpen) => {
          if (!isOpen) close();
        }}
        title="Edit shoutout"
        description="Update your message of appreciation."
        footer={
          <>
            <Button variant="secondary" disabled={busy} onClick={close}>
              Cancel
            </Button>
            <Button disabled={busy} icon={<CheckIcon size={16} />} onClick={save}>
              {busy ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      >
        <div className={styles.dialogContent}>
          <Textarea
            id={`edit-shoutout-message-${shoutout.uuid}`}
            label="Message"
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) return;
              if (event.nativeEvent.isComposing) return;
              event.preventDefault();
              save();
            }}
            disabled={busy}
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </Modal>
      <Modal
        id={`delete-shoutout-${shoutout.uuid}`}
        open={mode === 'delete'}
        onOpenChange={(isOpen) => {
          if (!isOpen) close();
        }}
        title="Are you sure you want to delete this shoutout?"
        description="You won’t be able to recover it."
        footer={
          <>
            <Button variant="secondary" disabled={busy} onClick={close}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              icon={<TrashIcon size={16} />}
              onClick={remove}
            >
              {busy ? 'Deleting…' : 'Delete shoutout'}
            </Button>
          </>
        }
      >
        <div className={styles.dialogContent}>
          <DottedBackground className={styles.deletePreview}>
            <ShoutoutDetails shoutout={shoutout} own={own} />
          </DottedBackground>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
