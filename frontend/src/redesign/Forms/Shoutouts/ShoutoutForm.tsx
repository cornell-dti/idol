import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  IconButton,
  Input,
  LabelledCheckbox,
  Pill,
  Textarea,
  useToast
} from '../../../design-system-2026/components';
import { Combobox } from '../../../design-system-2026/components/Combobox/Combobox';
import { PlusIcon, XIcon } from '../../../design-system-2026/icons';
import ImagesAPI from '../../../API/ImagesAPI';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import styles from './Shoutouts.module.css';

type Props = { user: IdolMember; members: readonly IdolMember[]; onSent: () => void };

export default function ShoutoutForm({ user, members, onSent }: Props): JSX.Element {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const recipientInput = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);
  const submitting = useRef(false);
  const uploaded = useRef<{ file: File; path: string } | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    setAttempted(true);
    setError('');
    if (!recipient.trim()) {
      recipientInput.current?.focus();
      return;
    }
    if (!message.trim()) {
      messageInput.current?.focus();
      return;
    }
    if (fileError) return;
    submitting.current = true;
    setBusy(true);
    try {
      let path = '';
      if (file) {
        if (uploaded.current?.file === file) path = uploaded.current.path;
        else {
          path = `shoutoutImages/${user.email}/${new Date().toISOString()}`;
          await ImagesAPI.uploadImage(file, path);
          uploaded.current = { file, path };
        }
      }
      const result = await ShoutoutsAPI.giveShoutout({
        giver: user,
        receiver: recipient.trim(),
        message: message.trim(),
        isAnon: anonymous,
        timestamp: Date.now(),
        hidden: false,
        uuid: '',
        images: path ? [path] : [],
        tags: tags.length ? tags : undefined
      });
      if (!result || result.error) throw new Error(result?.error || 'Please try again.');
      toast.add({ title: `Shoutout sent to ${recipient.trim()}.` });
      setRecipient('');
      setMessage('');
      setTags([]);
      setShowTags(false);
      setAnonymous(true);
      setFile(null);
      setAttempted(false);
      uploaded.current = null;
      if (input.current) input.current.value = '';
      onSent();
    } catch (reason) {
      setError(
        `Couldn’t send your shoutout. ${
          reason instanceof Error ? reason.message : 'Please try again.'
        }`
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Card header="Give someone a shoutout!">
      <form className={styles.form} noValidate onSubmit={submit} aria-busy={busy}>
        <fieldset disabled={busy} className={styles.fields}>
          <Input
            ref={recipientInput}
            id="shoutout-recipient"
            label="Who is awesome?"
            placeholder="Type their name(s) here..."
            required
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            error={attempted && !recipient.trim() ? 'Enter at least one recipient.' : undefined}
          />
          <Textarea
            ref={messageInput}
            id="shoutout-message"
            label="Why are they awesome?"
            placeholder="Type your shoutout here..."
            className={styles.messageInput}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={attempted && !message.trim() ? 'Write a message for your shoutout.' : undefined}
          />
          {showTags && (
            <div className={styles.tagField}>
              <Combobox
                id="shoutout-tags"
                label="Tag people (optional)"
                placeholder="Search members..."
                options={Array.from(
                  new Set(members.map((member) => `${member.firstName} ${member.lastName}`))
                ).filter((name) => !tags.includes(name))}
                value=""
                onValueChange={(name) => {
                  if (name)
                    setTags((current) => (current.includes(name) ? current : [...current, name]));
                }}
              />
              {tags.length > 0 && (
                <div className={styles.tags}>
                  {tags.map((name) => (
                    <Pill key={name}>
                      {name}
                      <IconButton
                        variant="tertiary"
                        size={24}
                        aria-label={`Remove ${name}`}
                        icon={<XIcon size={12} />}
                        onClick={() => setTags((current) => current.filter((tag) => tag !== name))}
                      />
                    </Pill>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className={styles.upload}>
            <label htmlFor="shoutout-photo">Upload picture (optional)</label>
            <input
              ref={input}
              id="shoutout-photo"
              type="file"
              accept="image/png,image/jpeg"
              className={styles.fileInput}
              tabIndex={-1}
              onChange={(event) => {
                const next = event.target.files?.[0];
                if (!next) return;
                if (!['image/png', 'image/jpeg'].includes(next.type)) {
                  setFileError('Choose a PNG or JPEG image.');
                  if (input.current) input.current.value = '';
                  return;
                }
                setFileError('');
                setFile(next);
                uploaded.current = null;
              }}
            />
            <div className={styles.uploadActions}>
              <Button
                variant="secondary"
                icon={<PlusIcon size={16} />}
                onClick={() => input.current?.click()}
              >
                {file ? 'Change file' : 'Choose file'}
              </Button>
              {!showTags && (
                <Button
                  variant="secondary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setShowTags(true)}
                >
                  Tag people
                </Button>
              )}
            </div>
            {fileError && (
              <p className={styles.error} role="alert">
                {fileError}
              </p>
            )}
            {file && (
              <div className={styles.attachment}>
                {preview && <img src={preview} width={64} height={64} alt="Selected attachment" />}
                <span>{file.name}</span>
                <IconButton
                  variant="tertiary"
                  aria-label="Remove picture"
                  icon={<XIcon size={16} />}
                  onClick={() => {
                    setFile(null);
                    setFileError('');
                    uploaded.current = null;
                    if (input.current) input.current.value = '';
                  }}
                />
              </div>
            )}
          </div>
          <div className={styles.formActions}>
            <LabelledCheckbox
              label="Keep anonymous?"
              checked={anonymous}
              onCheckedChange={setAnonymous}
              disabled={busy}
            />
            <Button type="submit" disabled={busy} icon={<PlusIcon size={16} />}>
              {busy ? 'Sending…' : 'Send shoutout'}
            </Button>
          </div>
        </fieldset>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </Card>
  );
}
