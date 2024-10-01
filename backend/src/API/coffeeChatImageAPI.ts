import {
  setImage,
  getImage,
  getAllImagesForMember,
  deleteImage,
  deleteAllImagesForMember
} from '../utils/image-utils';

export const setCoffeeChatProofImage = async (name: string): Promise<string> => setImage(name);

export const getCoffeeChatProofImage = async (name: string): Promise<string> => getImage(name);

export const allCoffeeChatProofImagesForMember = async (
  user: IdolMember
): Promise<readonly Image[]> => getAllImagesForMember(user, 'coffeeChatProofs');

export const deleteCoffeeChatProofImage = async (name: string): Promise<void> => {
  deleteImage(name);
};

export const deleteCoffeeChatProofImagesForMember = async (user: IdolMember): Promise<void> => {
  deleteAllImagesForMember(user, 'coffeeChatProofs');
};
