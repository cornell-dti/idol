import { bucket } from '../firebase';
import { getNetIDFromEmail, filterImagesResponse } from '../utils/memberUtil';
import { NotFoundError } from '../utils/errors';

/**
 * Determines which URL to use to send an email, depending on if the production
 * environment is used
 * @returns - The URL to use to send an email
 */
export const allMemberImages = async (): Promise<readonly ProfileImage[]> => {
  const files = await bucket.getFiles({ prefix: 'images/' });
  const images = await Promise.all(
    files[0].map(async (file) => {
      const signedURL = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60000 // 15 min
      });
      const fileName = await file.getMetadata().then((data) => data[1].body.name);
      return {
        fileName,
        url: signedURL[0]
      };
    })
  );
  return filterImagesResponse(images);
};

/**
 * Determines which URL to use to send an email, depending on if the production
 * environment is used
 * @param user - the member who made the request
 * @returns - The URL to use to send an email
 */
export const setMemberImage = async (user: IdolMember): Promise<string> => {
  const netId: string = getNetIDFromEmail(user.email);
  const file = bucket.file(`images/${netId}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

/**
 * Determines which URL to use to send an email, depending on if the production
 * environment is used
 * @param user - the member who made the request
 * @returns - The URL to use to send an email
 */
export const getMemberImage = async (user: IdolMember): Promise<string> => {
  const netId: string = getNetIDFromEmail(user.email);
  const file = bucket.file(`images/${netId}.jpg`);
  const fileExists = await file.exists().then((result) => result[0]);
  if (!fileExists) {
    throw new NotFoundError(`The requested image (${netId}.jpg) does not exist`);
  }
  const signedUrl = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60000
  });
  return signedUrl[0];
};
