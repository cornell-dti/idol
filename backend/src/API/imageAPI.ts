import { bucket } from '../firebase';
import { filterImagesResponse } from '../utils/memberUtil';
import { NotFoundError } from '../utils/errors';

/**
 * Sets image for member
 * @param name - the name of the image
 * @returns a Promise to the signed URL to the image file
 */
export const getWriteSignedURL = async (name: string): Promise<string> => {
  const file = bucket.file(`${name}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

/**
 * Gets image for member
 * @param name - the name of the image
 * @throws NotFoundError if the requested image does not exist
 * @returns a Promise to the signed URL to the image file
 */
export const getReadSignedURL = async (name: string): Promise<string> => {
  const file = bucket.file(`${name}.jpg`);
  const fileExists = await file.exists().then((result) => result[0]);
  if (!fileExists) {
    throw new NotFoundError(`The requested image (${name}) does not exist`);
  }
  const signedURL = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60000
  });
  return signedURL[0];
};

/**
 * Gets all profile images for members
 * @returns - an array of ProfileImage objects which includes file name and URL
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
 * Deletes image for member
 * @param name - the name of the image
 */
export const deleteImage = async (name: string): Promise<void> => {
  const imageFile = bucket.file(`${name}.jpg`);
  await imageFile.delete();
};

