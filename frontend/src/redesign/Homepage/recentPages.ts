export type RecentPage = { href: string; label: string };

const storageKey = (email: string) => `idol:recent-pages:${email}`;
const limit = 3;

export function readRecentPages(email: string): RecentPage[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(storageKey(email)) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(
        (page): page is RecentPage =>
          typeof page?.href === 'string' &&
          /^\/(?!\/)[^\s\\]+$/.test(page.href) &&
          typeof page.label === 'string' &&
          page.label.trim().length > 0
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function rememberPage(email: string, page: RecentPage): void {
  try {
    const previous = readRecentPages(email).filter(({ href }) => href !== page.href);
    window.localStorage.setItem(
      storageKey(email),
      JSON.stringify([page, ...previous].slice(0, limit))
    );
  } catch {
    // Search can still offer common actions when browser storage is unavailable.
  }
}
