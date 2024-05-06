import { bucket } from '../firebase';
import { getNetIDFromEmail } from '../utils/memberUtil';
import { NotFoundError } from '../utils/errors';

//get all images
export const allCoffeeChatProofImages = async (): Promise<readonly EventProofImage[]> => {
  const [files] = await bucket.getFiles({ prefix: 'coffeeChats/' });
  const images = await Promise.all(
    files.map(async (file) => {
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
    .filter((image) => image.fileName.length > 'coffeeChats/'.length)
    .map((image) => ({
      ...image,
      fileName: image.fileName.slice(image.fileName.indexOf('/') + 1)
    }));

  return images;
};

//get images for user
export const allCoffeeChatProofImagesForMember = async (
  user: IdolMember
): Promise<readonly EventProofImage[]> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `coffeeChats/${netId}` });
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
    .filter((image) => image.fileName.length > 'coffeeChats/'.length)
    .map((image) => ({
      ...image,
      fileName: image.fileName.slice(image.fileName.indexOf('/') + 1)
    }));

  return images;
};

//upload image for user
export const setEventProofImage = async (name: string, user: IdolMember): Promise<string> => {
  const file = bucket.file(`${name}.jpg`);
  const signedURL = await file.getSignedUrl({
    action: 'write',
    version: 'v4',
    expires: Date.now() + 15 * 60000 // 15 min
  });
  return signedURL[0];
};

//delete all images for user
export const deleteCoffeeChatProofImagesForMember = async (user: IdolMember): Promise<void> => {
  const netId: string = getNetIDFromEmail(user.email);
  const files = await bucket.getFiles({ prefix: `coffeeChats/${netId}` });
  Promise.all(
    files[0].map(async (file) => {
      file.delete();
    })
  );
};
