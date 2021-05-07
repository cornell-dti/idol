import SignInFormDao from './dao/SignInFormDao';
import { signInFormCollection } from './firebase';
import { SignInCheckResponse, SignInCreateResponse, SignInSubmitResponse } from '../../frontend/src/API/SignInFormAPI';
import { PermissionsManager } from './permissions';

const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await signInFormCollection.doc(id).get()).exists;

export const signInFormExists = async (
  id: string
): Promise<SignInCheckResponse> => {
  const formExists = await checkIfDocExists(id);
  return { exists: formExists };
};

export const createSignInForm = async (id: string, user: IdolMember): Promise<SignInCreateResponse> => {
  if(!PermissionsManager.canCreateSignIn(user)){
    return {
      success: false,
      id,
      error: { reason: 'You don\'t have permission to create a sign-in form!' }
    };
  }
  try {
    const createdSignIn = await SignInFormDao.createSignIn(id);
    return {
      success: createdSignIn,
      id,
      createdAt: Date.now()
    };
  } catch (e) {
    return {
      success: false,
      id,
      error: e,
    };
  }
}

export const signIn = async (
  id: string,
  user: IdolMember
): Promise<SignInSubmitResponse> => {
  try {
    const signedIn = await SignInFormDao.signIn(id, user.email);
    return {
      success: signedIn !== null && signedIn !== undefined,
      id,
      signedInAt: signedIn
    };
  } catch (e) {
    return {
      success: false,
      id,
      error: e,
      signedInAt: Date.now()
    };
  }
};
