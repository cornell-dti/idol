import { Input } from '../../../design-system-2026/components';
import { GlobeIcon, GithubLogoIcon, LinkedinLogoIcon } from '../../../design-system-2026/icons';
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
    github: <GithubLogoIcon size={16} />,
    linkedin: <LinkedinLogoIcon size={16} />,
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
