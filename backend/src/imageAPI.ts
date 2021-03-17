import { Request, Response } from 'express';
import { checkLoggedIn } from './api';
import { db, bucket } from './firebase';
import { ImageResponse, ErrorResponse } from './APITypes';
import { getNetIDFromEmail } from './util';

export const allMemberImages = async (
  req: Request,
  res: Response
): Promise<ImageResponse | ErrorResponse | undefined> => {
  return undefined;
};

export const setMemberImage = async (
  req: Request,
  res: Response
): Promise<ImageResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    const netId: string = getNetIDFromEmail(user.email);
    const file = bucket.file(`images/${netId}.jpg`);
    let signedURL = await file.getSignedUrl({
      action: 'write',
      version: 'v4',
      expires: Date.now() + 15 * 60000
      // contentType: 'image/jpeg'
    });
    return {
      status: 200,
      url: signedURL[0]
    };
  }
  return undefined;
};

export const getMemberImage = async (
  req: Request,
  res: Response
): Promise<ImageResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    if (user.email !== req.session!.email) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to get members!`
      };
    }
    const netId: string = getNetIDFromEmail(user.email);
    const file = bucket.file(`images/${netId}.jpg`);
    let fileExists = await file.exists().then((result) => result[0]);
    if (!fileExists) {
      return {
        status: 404,
        error: `The requested image (${netId}.jpg) does not exist`
      };
    }
    let signedUrl = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60000
    });
    return {
      status: 200,
      url: signedUrl[0]
    };
  }
  return undefined;
};
