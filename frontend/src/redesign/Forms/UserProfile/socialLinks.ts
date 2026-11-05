export const SOCIAL_PREFIXES = {
  website: 'https://',
  github: 'github.com/',
  linkedin: 'linkedin.com/',
  calendly: 'calendly.com/'
} as const;
export type SocialKind = keyof typeof SOCIAL_PREFIXES;

/** Accept pasted URLs, domains, or usernames without duplicating the fixed field prefix. */
export function socialDisplay(kind: SocialKind, input: string): string {
  let value = input.trim().replace(/^(?:(?:https?:)?\/\/)+/i, '');
  if (kind === 'website') return value;
  value = value.replace(/^www\./i, '');
  const host = SOCIAL_PREFIXES[kind].slice(0, -1);
  if (value.toLowerCase() === host) return '';
  if (value.toLowerCase().startsWith(`${host}/`)) value = value.slice(host.length + 1);
  return value.replace(/^@/, '');
}
export function normalizeSocialLink(kind: SocialKind, input: string): string {
  let value = socialDisplay(kind, input);
  if (!value) return '';
  if (kind === 'website') return `https://${value}`;
  if (kind === 'linkedin' && !/^(in|company|school|pub)\//i.test(value)) value = `in/${value}`;
  return `https://${SOCIAL_PREFIXES[kind]}${value}`;
}
