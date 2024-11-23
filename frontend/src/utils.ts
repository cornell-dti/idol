/* eslint-disable max-classes-per-file */

export const getNetIDFromEmail = (email: string): string => email.split('@')[0];

export const getRoleDescriptionFromRoleID = (role: Role): RoleDescription => {
  switch (role) {
    case 'ops-lead':
      return 'Full Team Lead';
    case 'product-lead':
      return 'Product Lead';
    case 'dev-lead':
      return 'Developer Lead';
    case 'design-lead':
      return 'Design Lead';
    case 'business-lead':
      return 'Business Lead';
    case 'tpm':
      return 'Technical PM';
    case 'pm':
      return 'Product Manager';
    case 'apm':
      return 'Associate PM';
    case 'developer':
      return 'Developer';
    case 'designer':
      return 'Designer';
    case 'business':
      return 'Business';
    case 'pm-advisor':
      return 'PM Advisor';
    case 'dev-advisor':
      return 'Dev Advisor';
    case 'design-advisor':
      return 'Design Advisor';
    case 'business-advisor':
      return 'Business Advisor';
    default:
      throw new Error();
  }
};

export const getLinesFromBoard = (bingoBoard: string[][]): string[][] => {
  const size = bingoBoard.length;

  return [
    ...bingoBoard, // Rows
    ...Array.from({ length: size }, (_, col) => bingoBoard.map((row) => row[col])), // Columns
    Array.from({ length: size }, (_, i) => bingoBoard[i][i]), // Primary diagonal
    Array.from({ length: size }, (_, i) => bingoBoard[i][size - 1 - i]) // Secondary diagonal
  ];
};

export class PermissionsError extends Error {}

export class EventEmitter<T> {
  private readonly subscribers: Set<(event: T) => unknown> = new Set();

  subscribe(subscriber: (event: T) => unknown): void {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: (event: T) => unknown): void {
    this.subscribers.delete(subscriber);
  }

  emit(event: T): void {
    Array.from(this.subscribers.values()).forEach((sub) => sub(event));
  }
}

export class Emitters {
  // Navigation
  static navOpenEmitter: EventEmitter<boolean> = new EventEmitter();

  // Login
  static emailNotFoundError: EventEmitter<void> = new EventEmitter();

  // Site-wide
  static generalError: EventEmitter<{
    headerMsg: string;
    contentMsg: string;
  }> = new EventEmitter();

  static generalSuccess: EventEmitter<{
    headerMsg: string;
    contentMsg: string;
    child?: JSX.Element;
  }> = new EventEmitter();

  // Users
  static userEditError: EventEmitter<{
    headerMsg: string;
    contentMsg: string;
  }> = new EventEmitter();

  // Teams
  static teamEditError: EventEmitter<{
    headerMsg: string;
    contentMsg: string;
  }> = new EventEmitter();

  // Sign-in code
  static signInCodeCreated: EventEmitter<void> = new EventEmitter();

  static signInCodeError: EventEmitter<{
    headerMsg: string;
    contentMsg: string;
  }> = new EventEmitter();

  // Team Events
  static teamEventsUpdated: EventEmitter<void> = new EventEmitter();

  // Dev Portfolio
  static devPortfolioUpdated: EventEmitter<void> = new EventEmitter();

  // Coffee Chats
  static coffeeChatsUpdated: EventEmitter<void> = new EventEmitter();
}

/**
 * Parses links from english text and fixes a provided link to ensure it adheres to a proper format for LinkedIn or GitHub profiles.
 * Also handles raw usernames (e.g., "jujulcrane") by constructing a proper URL.
 *
 * @param {string} link - The input link, which could be a full URL, partial URL, or raw username.
 * @param {boolean} git - Whether the link is for GitHub. If true, it processes the link as a GitHub URL.
 * @param {boolean} linkedIn - Whether the link is for LinkedIn. If true, it processes the link as a LinkedIn URL.
 * @returns {string | undefined} - The fixed and properly formatted link or undefined if the input is invalid.
 *
 * @example
 * fixLink("https://linkedin.com/in/jujulcrane", false, true);
 * // Returns: "https://www.linkedin.com/in/jujulcrane"
 *
 * @example
 * fixLink("github.com/jujulcrane", true, false);
 * // Returns: "https://github.com/jujulcrane"
 *
 * @example
 * fixLink("Visit my profiles: https://linkedin.com/in/jujulcrane and github.com/jujulcrane", false, true);
 * // Returns: undefined (multiple links in the input)
 *
 * @example
 * fixLink("jujulcrane", false, true);
 * // Returns: "https://www.linkedin.com/in/jujulcrane/"
 */
export const fixLink = (link: string, git: boolean, linkedIn: boolean): string | undefined => {
  if (!link) {
    return undefined;
  }

  const urlRegex =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
  const matches = link.match(urlRegex);

  if (matches && matches.length > 1) {
    return undefined;
  }

  if (!matches) {
    if (linkedIn) {
      return `https://www.linkedin.com/in/${link.trim().toLowerCase()}/`;
    }
    if (git) {
      return `https://github.com/${link.trim().toLowerCase()}`;
    }
    return undefined;
  }

  const extractedLink = matches[0]
    .trim()
    .replace(/[.,)]+$/, '')
    .toLowerCase();

  if (linkedIn) {
    if (extractedLink.startsWith('www.')) {
      return `https://${extractedLink}`;
    }
    if (extractedLink.startsWith('linkedin.com')) {
      return `https://www.${extractedLink}`;
    }
    if (!extractedLink.includes('linkedin.com/in')) {
      return `https://www.linkedin.com/in/${extractedLink}/`;
    }
    return extractedLink;
  }

  if (git) {
    if (extractedLink.startsWith('github.com')) {
      return `https://${extractedLink}`;
    }
    if (extractedLink.startsWith('www.github.com/')) {
      return `https://${extractedLink.substring(4)}`;
    }
    if (!extractedLink.includes('github.com')) {
      return `https://github.com/${extractedLink}`;
    }
    return extractedLink;
  }

  return extractedLink;
};
