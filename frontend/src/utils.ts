/* eslint-disable max-classes-per-file */

export const getNetIDFromEmail = (email: string): string => email.split('@')[0];

export const getRoleDescriptionFromRoleID = (role: Role): RoleDescription => {
  switch (role) {
    case 'lead':
      return 'Lead';
    case 'tpm':
      return 'Technical PM';
    case 'pm':
      return 'Product Manager';
    case 'developer':
      return 'Developer';
    case 'designer':
      return 'Designer';
    case 'business':
      return 'Business Analyst';
    case 'dev-advisor':
      return 'Dev Advisor';
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
