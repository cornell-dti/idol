import { Request } from 'express';
import { db, bucket } from './firebase';
import { getNetIDFromEmail, filterImagesResponse } from './util';
import { ProfileImage } from './DataTypes';
import { BadRequestError, NotFoundError, PermissionError } from './errors';

export const allMemberImages = async (): Promise<readonly ProfileImage[]> => {
  const files = await bucket.getFiles({ prefix: 'images/' });
  const images = await Promise.all(
    files[0].map(async (file) => {
      const signedURL = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60000 // 15 min
      });
      const fileName = await file
        .getMetadata()
        .then((data) => data[1].body.name);
      return {
        fileName,
        url: signedURL[0]
      };
    })
  );
  return filterImagesResponse(images);
};

export const setMemberImage = async (req: Request): Promise<string> => {
  const userEmail: string = req.session?.email as string;
  const user = (await db.doc(`members/${userEmail}`).get()).data();
  if (!user) throw new BadRequestError(`No user with email: ${userEmail}`);
  const netId: string = getNetIDFromEmail(user.email);
  const file = bucket.file(`images/${netId}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

export const getMemberImage = async (req: Request): Promise<string> => {
  const userEmail: string = req.session?.email as string;
  const user = (await db.doc(`members/${userEmail}`).get()).data();
  if (!user) throw new BadRequestError(`No user with email: ${userEmail}`);
  if (user.email !== userEmail) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to get members!`
    );
  }
  const netId: string = getNetIDFromEmail(user.email);
  const file = bucket.file(`images/${netId}.jpg`);
  const fileExists = await file.exists().then((result) => result[0]);
  if (!fileExists) {
    throw new NotFoundError(
      `The requested image (${netId}.jpg) does not exist`
    );
  }
  const signedUrl = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60000
  });
  return signedUrl[0];
};
