import {
  setImage,
  getImage,
  getAllImagesForMember,
  deleteImage,
  deleteAllImagesForMember
} from '../utils/image-utils';

export const setEventProofImage = async (name: string): Promise<string> => setImage(name);

export const getEventProofImage = async (name: string): Promise<string> => getImage(name);

export const allEventProofImagesForMember = async (user: IdolMember): Promise<readonly Image[]> =>
  getAllImagesForMember(user, 'eventProofs');

export const deleteEventProofImage = async (name: string): Promise<void> => {
  deleteImage(name);
};

export const deleteEventProofImagesForMember = async (user: IdolMember): Promise<void> => {
  deleteAllImagesForMember(user, 'eventProofs');
};
