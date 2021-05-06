import SignInFormDao from './dao/SignInFormDao';
import { signInFormCollection } from './firebase';

const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await signInFormCollection.doc(id).get()).exists;

export const signInFormExists = async (
  id: string
): Promise<{ exists: boolean }> => {
  const formExists = await checkIfDocExists(id);
  return { exists: formExists };
};

export const signIn = async (
  id: string,
  user: IdolMember
): Promise<{ success: boolean; id: string; error?: string }> => {
  try {
    const signedIn = await SignInFormDao.signIn(id, user.email);
    return {
      success: signedIn,
      id
    };
  } catch (e) {
    return {
      success: false,
      id,
      error: e
    };
  }
};
