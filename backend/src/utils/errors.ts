/* eslint-disable max-classes-per-file */

export class HandlerError extends Error {
  constructor(
    public readonly errorCode: number,
    public readonly reason: string
  ) {
    super();
  }
}

export class BadRequestError extends HandlerError {
  constructor(reason: string) {
    super(400, reason);
  }
}
export class UnauthorizedError extends HandlerError {
  constructor(reason: string) {
    super(401, reason);
  }
}

export class PermissionError extends HandlerError {
  constructor(reason: string) {
    super(403, reason);
  }
}

export class NotFoundError extends HandlerError {
  constructor(reason: string) {
    super(404, reason);
  }
}
