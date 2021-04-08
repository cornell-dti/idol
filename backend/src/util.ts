// This file contains common operations that will need to be performed often.

export const getNetIDFromEmail = (email: string): string => email.split('@')[0];

export const filterImagesResponse = (
  images: readonly { readonly fileName: string; readonly url: string }[]
): ProfileImage[] =>
  images
    .filter((image) => image.fileName.length > 7)
    .map((image) => ({
      ...image,
      fileName: image.fileName.slice(image.fileName.indexOf('/') + 1)
    }));
