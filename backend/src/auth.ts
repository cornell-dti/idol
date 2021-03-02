import { Request, Response, NextFunction } from 'express';
import { db } from './firebase';
import { enforceSession } from './api';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.auth_token) {
    // on login
    next();
  } else if (!enforceSession || req.session?.isLoggedIn) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      res.status(401).json({
        status: 401,
        error: `No user with email: ${req.session!.email}`
      });
    } else {
      res.locals.user = user;
      next();
    }
  } else {
    res.status(440).json({ error: 'Not logged in!' });
  }
};
