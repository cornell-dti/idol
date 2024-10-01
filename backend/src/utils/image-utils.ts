import { bucket } from '../firebase';
import { getNetIDFromEmail } from './memberUtil';
import { NotFoundError } from './errors';

/**
 * Sets image for member
 * @param name - the name of the image
 * @returns a Promise to the signed URL to the image file
 */
export const setImage = async (name: string): Promise<string> => {
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
export const getImage = async (name: string): Promise<string> => {
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
 * Gets all images associated with the IdolMember
 * @param user - the member who made the request
 * @param type - the type of image (ex: eventProof, coffeeChatProof)
 * @returns a Promise which results in an array of ProofImage with file name and signed URL
 */
export const getAllImagesForMember = async (
  user: IdolMember,
  type: string
): Promise<readonly Image[]> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `${type}/${netId}` });
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

  images
    .filter((image) => image.fileName.length > `${type}/`.length)
    .map((image) => ({
      ...image,
      fileName: image.fileName.slice(image.fileName.indexOf('/') + 1)
    }));

  return images;
};

/**
 * Deletes image for member
 * @param name - the name of the image
 */
export const deleteImage = async (name: string): Promise<void> => {
  const imageFile = bucket.file(`${name}.jpg`);
  await imageFile.delete();
};

/**
 * Deletes all images for given member
 * @param user - the member who made the request
 * @param type - the type of image (ex: eventProof, coffeeChatProof)
 */
export const deleteAllImagesForMember = async (user: IdolMember, type: string): Promise<void> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `${type}/${netId}` });
  Promise.all(
    files[0].map(async (file) => {
      file.delete();
    })
  );
};
