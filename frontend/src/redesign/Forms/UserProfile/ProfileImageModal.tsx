import { useEffect, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button, IconButton, Modal } from '../../../design-system-2026/components';
import { Slider } from '../../../design-system-2026/components/Slider/Slider';
import {
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  UploadSimpleIcon,
  CheckIcon
} from '../../../design-system-2026/icons';
import useProfileEditor from '../../../components/Forms/UserProfile/useProfileEditor';
import styles from './ProfileImageModal.module.css';

type Props = { profile: ReturnType<typeof useProfileEditor> };
export default function ProfileImageModal({ profile }: Props): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState('');
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const url = file ? URL.createObjectURL(file) : profile.profilePhoto;
    setImage(url);
    setLoaded(false);
    setScale(1);
    setRotate(0);
    setPosition({ x: 0.5, y: 0.5 });
    setError('');
    return () => {
      if (file) URL.revokeObjectURL(url);
    };
  }, [file, profile.profilePhoto]);
  useEffect(() => {
    if (!profile.open) {
      setFile(null);
      setScale(1);
      setRotate(0);
      setPosition({ x: 0.5, y: 0.5 });
      setError('');
      setDragging(false);
      dragDepth.current = 0;
    }
  }, [profile.open]);
  const selectFile = (next?: File) => {
    if (!next || profile.savingPhoto) return;
    if (['image/png', 'image/jpeg'].includes(next.type)) setFile(next);
    else setError('Choose a PNG or JPEG image.');
  };
  return (
    <Modal
      id="profile-image-editor"
      title="Edit profile picture"
      description="Upload a photo, then drag to reposition and adjust the crop."
      open={profile.open}
      surfaceClassName={dragging ? styles.dropSurface : ''}
      surfaceOverlay={
        dragging ? (
          <div className={styles.dropOverlay} role="status">
            <UploadSimpleIcon size={40} aria-hidden="true" />
            <h2>Drop to upload</h2>
            <p>PNG or JPEG</p>
          </div>
        ) : undefined
      }
      popupProps={{
        onDragEnter: (event) => {
          if (!Array.from(event.dataTransfer.types).includes('Files') || profile.savingPhoto)
            return;
          event.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        },
        onDragOver: (event) => {
          if (!Array.from(event.dataTransfer.types).includes('Files')) return;
          event.preventDefault();
          const { dataTransfer } = event;
          dataTransfer.dropEffect = profile.savingPhoto ? 'none' : 'copy';
        },
        onDragLeave: (event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        },
        onDrop: (event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }
      }}
      onOpenChange={(open) => {
        if (!profile.savingPhoto) profile.setOpen(open);
      }}
      trigger={
        <Button
          variant="secondary"
          icon={
            <img
              className={styles.editIcon}
              src="/design-system/figma/profile/edit.svg"
              alt=""
              width={16}
              height={16}
            />
          }
        >
          Edit profile picture
        </Button>
      }
      footer={
        <>
          <Button
            variant="secondary"
            disabled={profile.savingPhoto}
            onClick={() => profile.setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            icon={<CheckIcon size={16} />}
            disabled={!loaded || profile.savingPhoto}
            onClick={profile.cropAndSubmitImage}
          >
            {profile.savingPhoto ? 'Saving…' : 'Save picture'}
          </Button>
        </>
      }
    >
      <div className={styles.editor}>
        <div className={styles.preview}>
          {image ? (
            <AvatarEditor
              key={String(profile.open)}
              ref={profile.setEditorRef}
              position={position}
              onPositionChange={setPosition}
              image={image}
              width={250}
              height={250}
              border={16}
              borderRadius={125}
              scale={scale}
              rotate={rotate}
              crossOrigin="anonymous"
              onImageReady={() => setLoaded(true)}
              onLoadFailure={() => {
                setLoaded(false);
                setError('This image could not be loaded. Choose a new photo to continue.');
              }}
            />
          ) : (
            <p>Choose a photo to get started.</p>
          )}
        </div>
        <div className={styles.controls}>
          <input
            ref={input}
            className={styles.fileInput}
            type="file"
            accept="image/png,image/jpeg"
            aria-label="Choose profile photo"
            disabled={profile.savingPhoto}
            onChange={(event) => {
              selectFile(event.target.files?.[0]);
              const fileInput = event.target;
              fileInput.value = '';
            }}
          />
          <Button
            variant="secondary"
            icon={<UploadSimpleIcon size={16} />}
            disabled={profile.savingPhoto}
            onClick={() => input.current?.click()}
          >
            Choose photo
          </Button>
          <p className={styles.hint}>{file?.name ?? 'PNG or JPEG'}</p>
          <Slider
            id="profile-photo-zoom"
            label="Zoom"
            min={1}
            max={2}
            step={0.01}
            value={scale}
            disabled={!loaded || profile.savingPhoto}
            onChange={(event) => setScale(Number(event.target.value))}
          />
          <div className={styles.rotation}>
            <span>Rotate</span>
            <IconButton
              aria-label="Rotate left"
              icon={<ArrowCounterClockwiseIcon size={16} />}
              disabled={!loaded || profile.savingPhoto}
              onClick={() => setRotate(rotate - 90)}
            />
            <IconButton
              aria-label="Rotate right"
              icon={<ArrowClockwiseIcon size={16} />}
              disabled={!loaded || profile.savingPhoto}
              onClick={() => setRotate(rotate + 90)}
            />
          </div>
        </div>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </Modal>
  );
}
