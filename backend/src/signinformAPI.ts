import SignInFormDao from './dao/SignInFormDao';
import { signInFormCollection } from './firebase';
import { SignInAllResponse, SignInCheckResponse, SignInCreateResponse, SignInDeleteResponse, SignInSubmitResponse } from '../../frontend/src/API/SignInFormAPI';
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
  if(!PermissionsManager.canEditSignIn(user)){
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

export const deleteSignInForm = async (id: string, user: IdolMember): Promise<SignInDeleteResponse> => {
  if(!PermissionsManager.canEditSignIn(user)){
    return {
      success: false,
      error: { reason: 'You don\'t have permission to create a sign-in form!' }
    };
  }
  try {
    const deletedSignInForm = await SignInFormDao.deleteSignIn(id);
    return {
      success: deletedSignInForm,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
}

export const allSignInForms = async (user: IdolMember): Promise<SignInAllResponse> => {
  if(!PermissionsManager.canEditSignIn(user)){
    return {
      forms: []
    }
  }
  try {
    const gotAllSignIns = await SignInFormDao.allSignInForms();
    return {
      forms: gotAllSignIns
    };
  } catch (e) {
    return {
      forms: []
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
