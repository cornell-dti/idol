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

type LinkType = 'github' | 'linkedin';
/**
 * Parses links from english text and fixes a provided link to ensure it adheres to a proper format for LinkedIn or GitHub profiles.
 * Also handles raw usernames (e.g., "jujulcrane") by constructing a proper URL.
 *
 * @param {string} link - The input link, which could be a full URL, partial URL, or raw username.
 * @param {LinkType} linkType - The type of link if either GitHub or LinkedIn.
 * @returns {string | undefined} - The fixed and properly formatted link or undefined if the input is invalid.
 *
 * @example
 * formatLink("https://linkedin.com/in/jujulcrane", "linkedin");
 * // Returns: "https://www.linkedin.com/in/jujulcrane"
 *
 * @example
 * formatLink("github.com/jujulcrane", "github");
 * // Returns: "https://github.com/jujulcrane"
 *
 * @example
 * formatLink("Visit my profiles: https://linkedin.com/in/jujulcrane and https://github.com/jujulcrane", "linkedin");
 * // Returns: undefined (multiple links in the input)
 *
 * @example
 * formatLink("jujulcrane", "linkedin");
 * // Returns: "https://www.linkedin.com/in/jujulcrane/"
 */
export const formatLink = (link: string, linkType?: LinkType): string | undefined => {
  if (!link) {
    return undefined;
  }

  const urlRegex =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
  const matches = link.match(urlRegex);

  if (matches && matches.length > 1) {
    return undefined;
  }

  if (!matches) {
    if (linkType) {
      if (!link.includes(' ')) {
        switch (linkType) {
          case 'linkedin':
            return `https://www.linkedin.com/in/${link.trim().toLowerCase()}`;
          case 'github':
            return `https://github.com/${link.trim().toLowerCase()}`;
          default:
            return undefined;
        }
      }
    }
    return undefined;
  }

  const extractedLink = matches[0].trim().replace(/[.,)]+$/, ''); // removes any trailing punctuation

  if (!extractedLink.startsWith('https://') && !extractedLink.startsWith('http://')) {
    return `https://${extractedLink}`;
  }

  return extractedLink;
};

/**
 * Parses a csv file into a two-length array where the first element is an array of headers and
 * the second element is an array of responses. The indices of the headers correspond to the
 * response indices.
 * @param csv A rectangular csv file
 * @returns A promise that resolves into an array of headers and responses
 */
export const parseCsv = async (csv: File): Promise<[string[], string[][]]> => {
  const text = await csv.text();
  const rows = text.split('\n').map((row) => row.trim());

  const headers = rows[0].split(',').map((header) => header.toLowerCase());
  const responses = rows.splice(1).map((row) => row.split(','));
  return [headers, responses];
};

/**
 *
 * @param csv
 * @returns
 */
export const fpo = async (csv: File): Promise<[string[], string[][]]> => {
  const text = await csv.text();
  const rows = text.split('\n').map((row) => row.trim());

  const headers = rows[0].split(',').map((header) => header.toLowerCase());
  const responses = rows.splice(1).map((row) => row.split(','));
  return [headers, responses];
};
