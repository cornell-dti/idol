import { bucket } from './firebase';
import { getNetIDFromEmail } from './util';
import { NotFoundError } from './errors';

export const setProofImage = async (user: IdolMember, name: string): Promise<string> => {
  const netId: string = getNetIDFromEmail(user.email);
  const file = bucket.file(`eventProofs/${netId}/${name}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

export const getProofImage = async (user: IdolMember, name: string): Promise<string> => {
  const netId: string = getNetIDFromEmail(user.email);
  const file = bucket.file(`eventProofs/${netId}/${name}.jpg`);
  const fileExists = await file.exists().then((result) => result[0]);
  if (!fileExists) {
    throw new NotFoundError(`The requested image (${netId}/${name}.jpg) does not exist`);
  }
  const signedUrl = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60000
  });
  return signedUrl[0];
};

export const allProofImagesForMember = async (
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

export const deleteProofImage = async (user: IdolMember, name: string): Promise<void> => {
  const netId: string = getNetIDFromEmail(user.email);
  const imageFile = bucket.file(`eventProofs/${netId}/${name}.jpg`);
  await imageFile.delete();
};

export const deleteProofImagesForMember = async (user: IdolMember): Promise<void> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `eventProofs/${netId}` });
  Promise.all(
    files[0].map(async (file) => {
      file.delete();
    })
  );
};
