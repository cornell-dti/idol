import { ClipboardTextIcon, ClockIcon } from '../../design-system-2026/icons';
import type { Icon } from '../../design-system-2026/icons';
import { breadcrumbRoutes } from '../breadcrumbRoutes';
import type { RecentPage } from './recentPages';
import { shortcuts } from './shortcuts';

export type SearchPage = RecentPage & { icon: Icon; description?: string; keywords?: string };

const keywords: Record<string, string> = {
  '/': 'homepage start overview',
  '/settings':
    'preferences appearance theme dark mode light mode accent color change switch toggle',
  '/help': 'support documentation faq questions report a bug',
  '/forms': 'forms submit application',
  '/forms/signin': 'sign in signin check in checkin meeting attendance submit',
  '/forms/profile':
    'account personal information bio photo picture pic headshot avatar social links pronouns major edit update change',
  '/forms/shoutouts': 'shout outs appreciation thanks kudos give send write post sent received',
  '/forms/teamEventCredits':
    'tec tecs team events credits attendance submit request log earn hours proof photo picture',
  '/forms/devPortfolio':
    'developer development portfolio assignments github pr prs pull requests submit submissions',
  '/forms/coffeeChats': 'coffee chat chats bingo submit log',
  '/forms/coffeeChatCategories': 'coffee chat topics bingo categories submit',
  '/forms/reimbursement':
    'submit request reimburse expense expenses report refund receipt payment money',
  '/alumni': 'alumni graduates former members',
  '/candidate-decider': 'applicants applications decisions reviews recruitment candidate instance',
  '/interview-scheduler': 'interviews book schedule slots appointment time',
  '/admin': 'administration manage tools',
  '/admin/member-review': 'approve profiles member information review',
  '/admin/site-deployer': 'deploy publish dti website',
  '/admin/signin-creator': 'create sign in signin check in attendance form',
  '/admin/shoutouts': 'manage presentation appreciation kudos',
  '/admin/edit': 'add user edit member members roles permissions',
  '/admin/teams/edit': 'edit manage subteams roster',
  '/admin/team-events': 'manage events attendance create event',
  '/admin/team-events/dashboard': 'tec credits attendance statistics report',
  '/admin/candidate-decider': 'manage create edit candidate review applications',
  '/admin/dev-portfolio': 'review submissions assignments github prs',
  '/admin/coffee-chats': 'review approve reject coffee chats submissions categories',
  '/admin/coffee-chats/dashboard': 'coffee chat statistics report metrics',
  '/admin/interview-scheduler': 'manage create edit interview schedule slots',
  '/admin/interview-status': 'track interview progress status',
  '/admin/recruitment-timeline': 'recruiting dates deadlines calendar',
  '/admin/alumni-admin-view': 'edit manage graduates former members',
  '/admin/reimbursement': 'review approve expenses refunds receipts'
};

const isAdmin = (path: string) => path === '/admin' || path.startsWith('/admin/');
const isDesignPreview = (path: string) =>
  path === '/design-system-2026' || path.startsWith('/design-system-2026/');
const routeEntries = Object.entries(breadcrumbRoutes).filter(([path]) => !isDesignPreview(path));
const detailRoutes = routeEntries.filter(([path]) => path.includes('['));
/** Conversational words that never decide which page matches. */
const fillerWords = new Set(
  (
    'a about an and any are at can could do for find go how i id im in into is it lets me my of ' +
    'on open our out please pls show some that the there this to up want wanna we where which ' +
    'with would you your need like'
  ).split(' ')
);
/** Actions people type ("submit tec"): they rank pages that mention them, but never exclude one. */
const intentWords = new Set(
  (
    'add apply browse change check create edit enter file fill get give log look make manage new ' +
    'post record request see send start submit submitting track update upload view write'
  ).split(' ')
);

export const normalizeSearch = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function pageForRoute(route: string, href = route, visitedLabel?: string): SearchPage {
  const { label, parent, icon } = breadcrumbRoutes[route];
  const shortcut = shortcuts.find((item) => item.href === route);
  const parentLabel = parent && breadcrumbRoutes[parent].label;
  const title = visitedLabel || shortcut?.label || label;
  const context = label === 'Dashboard' && parentLabel ? `${parentLabel} ${title}` : title;
  return {
    href,
    label: isAdmin(route) && route !== '/admin' ? `Admin · ${context}` : context,
    description: shortcut?.description ?? (parentLabel === 'Admin' ? undefined : parentLabel),
    icon: icon ?? (visitedLabel ? ClockIcon : ClipboardTextIcon),
    keywords: keywords[route]
  };
}

const pages = routeEntries
  .filter(([route]) => !route.includes('['))
  .map(([route]) => pageForRoute(route));

export const commonActions = shortcuts.slice(0, 3).map(({ href }) => pageForRoute(href));

function findRoute(path: string): string | undefined {
  if (isDesignPreview(path)) return undefined;
  if (Object.hasOwn(breadcrumbRoutes, path)) return path.includes('[') ? undefined : path;
  const segments = path.split('/');
  return detailRoutes.find(([route]) => {
    const template = route.split('/');
    return (
      template.length === segments.length &&
      template.every((part, index) =>
        part.startsWith('[') ? /^[a-z0-9_-]+$/i.test(segments[index]) : part === segments[index]
      )
    );
  })?.[0];
}

export function recentSearchPages(visited: RecentPage[], canAdmin: boolean): SearchPage[] {
  return visited.flatMap(({ href, label }) => {
    const route = findRoute(href);
    if (!route || (isAdmin(route) && !canAdmin)) return [];
    return [pageForRoute(route, href, route.includes('[') ? label : undefined)];
  });
}

function pathFromInput(query: string): URL | undefined {
  const text = query.trim();
  const path = /^[a-z0-9-]+\/\S+$/i.test(text) ? `/${text}` : text;
  if (!/^(?:\/[^/]|\/$|https?:\/\/)/i.test(path)) return undefined;
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin === window.location.origin || url.origin === 'https://idol.cornelldti.org')
      return url;
  } catch {
    // Keep treating incomplete or invalid URLs as ordinary search text.
  }
  return undefined;
}

/** Allow one typo in a longer word, including adjacent letters typed out of order. */
function oneEdit(left: string, right: string): boolean {
  if (Math.abs(left.length - right.length) > 1) return false;
  const first = Array.from(left).findIndex((letter, index) => letter !== right[index]);
  if (first === -1) return true;
  const a = left.slice(first);
  const b = right.slice(first);
  if (a.length > b.length) return a.slice(1) === b;
  if (a.length < b.length) return b.slice(1) === a;
  return a.slice(1) === b.slice(1) || (a[0] === b[1] && a[1] === b[0] && a.slice(2) === b.slice(2));
}

/** Reduce plurals and verb endings so "credits", "chats" or "reimbursed" find their pages. */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function wordScore(word: string, terms: string[], weight: number): number {
  const root = stem(word);
  if (terms.some((term) => term === word || stem(term) === root)) return weight + 3;
  if (terms.some((term) => term.startsWith(word) || (root.length >= 3 && term.startsWith(root))))
    return weight + 2;
  if (terms.some((term) => term.includes(word))) return weight + 1;
  if (word.length >= 4 && terms.some((term) => oneEdit(word, term))) return 1;
  return 0;
}

export function searchPages(query: string, canAdmin: boolean, recent: SearchPage[]): SearchPage[] {
  const url = pathFromInput(query);
  if (url) {
    const path = url.pathname.replace(/\/$/, '') || '/';
    const route = findRoute(path);
    if (route) {
      if (isAdmin(route) && !canAdmin) return [];
      const href = `${path}${url.search}${url.hash}`;
      const visited = recent.find((page) => page.href === path);
      return [visited ? { ...visited, href } : pageForRoute(route, href)];
    }
  }

  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  const inputWords = normalized.split(' ');
  const meaningfulWords = inputWords.filter((word) => !fillerWords.has(word));
  const subjectWords = meaningfulWords.filter((word) => !intentWords.has(word));
  // Every subject word must match; an action word alone ("submit") still has to match.
  const words = [subjectWords, meaningfulWords, inputWords].find((list) => list.length) ?? [];
  const optionalWords = subjectWords.length
    ? meaningfulWords.filter((word) => intentWords.has(word))
    : [];
  const phrase = words.join(' ');
  const details = recent.filter(({ href }) => !Object.hasOwn(breadcrumbRoutes, href));
  return [...pages, ...details]
    .filter(({ href }) => canAdmin || !isAdmin(href))
    .map((page) => {
      const label = normalizeSearch(page.label);
      if (phrase.length >= 4 && label.replace(/ /g, '') === phrase.replace(/ /g, '')) {
        return { page, score: 40 };
      }
      const titleWords = label.split(' ');
      const terms = normalizeSearch(
        `${page.keywords ?? ''} ${page.description ?? ''} ${page.href.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        )}`
      ).split(' ');
      const scoreWord = (word: string) =>
        Math.max(wordScore(word, titleWords, 5), wordScore(word, terms, 2));
      const scores = words.map(scoreWord);
      const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
      const score = scores.every(Boolean)
        ? sum(scores) + sum(optionalWords.map(scoreWord)) + (label.startsWith(phrase) ? 10 : 0)
        : 0;
      return { page, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ page }) => page);
}
