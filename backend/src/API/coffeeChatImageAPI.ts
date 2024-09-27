import { bucket } from '../firebase';
import { NotFoundError } from '../utils/errors';

/**
 * Gets Coffee Chat proof image for member
 * @param name - the name of the image
 * @param user - the member who made the request
 * @throws NotFoundError if the requested image does not exist
 * @returns a Promise to the signed URL to the image file
 */
export const getCoffeeChatProofImage = async (name: string): Promise<string> => {
  const file = bucket.file(`${name}.jpg`);
  const fileExists = await file.exists().then((result) => result[0]);
  if (!fileExists) {
    throw new NotFoundError(`The requested image (${name}) does not exist`);
  }
  const signedUrl = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60000
  });
  return signedUrl[0];
};

/**
 * Sets Coffee Chat proof image for member
 * @param name - the name of the image
 * @param user - the member who made the request
 * @returns a Promise to the signed URL to the image file
 */
export const setCoffeeChatProofImage = async (name: string): Promise<string> => {
  const file = bucket.file(`${name}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

/**
 * Deletes Coffee Chat proof image for member
 * @param name - the name of the image
 * @param user - the member who made the request
 */
export const deleteCoffeeChatProofImage = async (name: string): Promise<void> => {
  const imageFile = bucket.file(`${name}.jpg`);
  await imageFile.delete();
};
