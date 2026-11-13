import { useEffect, useState } from 'react';
import { Avatar, Card, IconButton } from '../../design-system-2026/components';
import { EnvelopeSimpleIcon, LinkedinLogoIcon } from '../../design-system-2026/icons';
import ImagesAPI from '../../API/ImagesAPI';
import HeadshotPlaceholder from '../../static/images/headshot-placeholder.png';
import { DTI_ROLE_LABELS, fullName } from './alumniFilters';
import styles from './Alumni.module.css';

const STORED_IMAGE_PREFIX = 'alumImages/';
const BEAR_IMAGES = [
  '/alumni/fallback-1.svg',
  '/alumni/fallback-2.svg',
  '/alumni/fallback-3.svg',
  '/alumni/fallback-4.svg'
];

/** The same bear for an alum every time, for alumni without a photo. */
const bearImage = (uuid: string): string =>
  BEAR_IMAGES[
    uuid.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % BEAR_IMAGES.length
  ];

/** Resolves stored headshots to a URL: `null` while resolving, `''` when there is none. */
function useHeadshot(imageUrl: string): string | null {
  const stored = imageUrl.startsWith(STORED_IMAGE_PREFIX);
  const [url, setUrl] = useState<string | null>(stored ? null : imageUrl);
  useEffect(() => {
    if (!stored) {
      setUrl(imageUrl);
      return () => {};
    }
    let active = true;
    setUrl(null);
    ImagesAPI.getImage(imageUrl)
      .then((next) => {
        if (active) setUrl(next === HeadshotPlaceholder.src ? '' : next);
      })
      .catch(() => {
        if (active) setUrl('');
      });
    return () => {
      active = false;
    };
  }, [imageUrl, stored]);
  return url;
}

const list = (values?: readonly string[] | null) => (values?.length ? values.join(', ') : null);

export default function AlumniCard({ alum }: { readonly alum: Alumni }): JSX.Element {
  const name = fullName(alum);
  const headshot = useHeadshot(alum.imageUrl ?? '');
  const facts: [string, string | number | null | undefined][] = [
    ['Career path', alum.jobCategory],
    ['Based in', alum.location],
    ['Class of', alum.gradYear],
    ['Role on DTI', list(alum.dtiRoles?.map((role) => DTI_ROLE_LABELS[role] ?? role))],
    ['Subteam', list(alum.subteams)]
  ];
  return (
    <Card layered direction="row" className={styles.alumCard}>
      <div className={styles.alumPhoto}>
        {headshot === null ? (
          <span className="idol-skeleton" aria-hidden="true" />
        ) : (
          <Avatar
            name={name}
            size={96}
            src={headshot || undefined}
            fallbackSrc={bearImage(alum.uuid)}
            decorative
          />
        )}
      </div>
      <div className={styles.alumDetails}>
        <div className={styles.alumHeading}>
          <div className={styles.alumTitle}>
            <h3>{name}</h3>
            <p>
              {alum.jobRole}
              {alum.company && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className={styles.visuallyHidden}> at </span>
                  {alum.company}
                </>
              )}
            </p>
          </div>
          <div className={styles.alumLinks}>
            {alum.email && (
              <IconButton
                variant="tertiary"
                aria-label={`Email ${name}`}
                icon={<EnvelopeSimpleIcon size={18} />}
                nativeButton={false}
                render={({ children, ...props }) => (
                  <a {...props} href={`mailto:${alum.email}`} role={undefined}>
                    {children}
                  </a>
                )}
              />
            )}
            {alum.linkedin && (
              <IconButton
                variant="tertiary"
                aria-label={`${name} on LinkedIn (opens in a new tab)`}
                icon={<LinkedinLogoIcon size={18} />}
                nativeButton={false}
                render={({ children, ...props }) => (
                  <a
                    {...props}
                    href={alum.linkedin ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    role={undefined}
                  >
                    {children}
                  </a>
                )}
              />
            )}
          </div>
        </div>
        <dl className={styles.facts}>
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={value ? undefined : styles.missing}>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}
