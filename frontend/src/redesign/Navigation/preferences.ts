export const defaultNavigation = ['/forms/shoutouts', '/forms/teamEventCredits'];
export const maxPinnedPages = 3;

/** Home and More are fixed; only two or three allowed pages can occupy the middle. */
export function parseNavigation(value: string | null, allowed: readonly string[]): string[] {
  let parsed: unknown;
  try {
    parsed = value === null ? defaultNavigation : JSON.parse(value);
  } catch {
    parsed = defaultNavigation;
  }
  const pages = Array.isArray(parsed)
    ? Array.from(new Set(parsed.filter((id): id is string => allowed.includes(id))))
    : [];
  const fallback = [...defaultNavigation, ...allowed].filter((id) => allowed.includes(id));
  while (pages.length < 2) {
    const next = fallback.find((id) => !pages.includes(id));
    if (!next) break;
    pages.push(next);
  }
  return pages.slice(0, maxPinnedPages);
}

export const compactNavigationLabel = (id: string, label: string): string =>
  ({ '/forms/teamEventCredits': 'TEC', '/forms/devPortfolio': 'Portfolio' })[id] ?? label;
