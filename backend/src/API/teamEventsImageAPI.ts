import { bucket } from '../firebase';
import { getNetIDFromEmail } from '../utils/memberUtil';
import { NotFoundError } from '../utils/errors';

/**
 * Sets TEC proof image for member
 * @param name - the name of the image
 * @param user - an IdolMember object
 * @returns a Promise to the signed URL to the image file
 */
export const setEventProofImage = async (name: string, user: IdolMember): Promise<string> => {
  const file = bucket.file(`${name}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

/**
 * Gets TEC proof image for member
 * @param name - the name of the image
 * @param user - an IdolMember object
 * @throws NotFoundError if the request image does not exist
 * @returns a Promise to the signed URL to the image file
 */
export const getEventProofImage = async (name: string, user: IdolMember): Promise<string> => {
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
 * Gets all TEC proof images associated with the IdolMember
 * @param user - an IdolMember object
 * @returns a Promise which results in an array of EventProofImage with file name and signed URL
 */
export const allEventProofImagesForMember = async (
  user: IdolMember
): Promise<readonly EventProofImage[]> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `eventProofs/${netId}` });
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
    .filter((image) => image.fileName.length > 'eventProofs/'.length)
    .map((image) => ({
      ...image,
      fileName: image.fileName.slice(image.fileName.indexOf('/') + 1)
    }));
  return images;
};

/**
 * Deletes TEC proof image for member
 * @param name - the name of the image
 * @param user - an IdolMember object
 */
export const deleteEventProofImage = async (name: string, user: IdolMember): Promise<void> => {
  const imageFile = bucket.file(`${name}.jpg`);
  await imageFile.delete();
};

/**
 * Deletes all TEC proof images for given member
 * @param user - an IdolMember object
 */
export const deleteEventProofImagesForMember = async (user: IdolMember): Promise<void> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `eventProofs/${netId}` });
  Promise.all(
    files[0].map(async (file) => {
      file.delete();
    })
  );
};