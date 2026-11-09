import { CSSProperties } from 'react';
import GitHubMark from '../../../../../new-dti-website/public/github.svg';
import { Input } from '../../../design-system-2026/components';
import { GlobeIcon } from '../../../design-system-2026/icons';
import { SocialKind, SOCIAL_PREFIXES, normalizeSocialLink, socialDisplay } from './socialLinks';
import styles from './SocialInput.module.css';

export default function SocialInput({
  kind,
  id,
  label,
  value,
  onChange,
  hint
}: {
  readonly kind: SocialKind;
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly hint?: string;
}): JSX.Element {
  const icons = {
    website: <GlobeIcon size={16} />,
    github: (
      <span
        className={styles.brandMark}
        style={{ '--brand-mark': `url("${GitHubMark.src}")` } as CSSProperties}
      />
    ),
    linkedin: (
      <svg
        className={styles.linkedinMark}
        viewBox="0 0 72 72"
        fill="currentColor"
        fillRule="evenodd"
        aria-hidden="true"
      >
        <path d="M62 62H51.315625V43.8021149C51.315625 38.8127542 49.4197917 36.0245323 45.4707031 36.0245323C41.1746094 36.0245323 38.9300781 38.9261103 38.9300781 43.8021149V62H28.6333333V27.3333333H38.9300781V32.0029283S42.0260417 26.2742151 49.3825521 26.2742151C56.7356771 26.2742151 62 30.7644705 62 40.051212V62ZM16.349349 22.7940133C12.8420573 22.7940133 10 19.9296567 10 16.3970067C10 12.8643566 12.8420573 10 16.349349 10C19.8566406 10 22.6970052 12.8643566 22.6970052 16.3970067C22.6970052 19.9296566 19.8566406 22.7940133 16.349349 22.7940133ZM11.0325521 62H21.769401V27.3333333H11.0325521V62Z" />
      </svg>
    ),
    calendly: <span className={styles.calendly} />
  };
  return (
    <Input
      id={id}
      label={label}
      value={socialDisplay(kind, value)}
      prefix={SOCIAL_PREFIXES[kind]}
      icon={icons[kind]}
      hint={hint}
      placeholder={kind === 'website' ? 'yourwebsite.com' : 'username'}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      onChange={(event) => onChange(normalizeSocialLink(kind, event.target.value))}
      onPaste={(event) => {
        event.preventDefault();
        onChange(normalizeSocialLink(kind, event.clipboardData.getData('text')));
      }}
    />
  );
}
