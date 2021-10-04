import SignInFormDao from './dao/SignInFormDao';
import { PermissionError } from './errors';
import { signInFormCollection } from './firebase';
import { PermissionsManager } from './permissions';

const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await signInFormCollection.doc(id).get()).exists;

export const signInFormExists: (id: string) => Promise<boolean> = checkIfDocExists;

export const createSignInForm = async (
  id: string,
  expireAt: number,
  user: IdolMember
): Promise<{ id: string; createdAt: number }> => {
  if (!PermissionsManager.canEditSignIn(user)) {
    throw new PermissionError("You don't have permission to create a sign-in form!");
  }
  await SignInFormDao.createSignIn(id, expireAt);
  return { id, createdAt: Date.now() };
};

export const deleteSignInForm = async (id: string, user: IdolMember): Promise<void> => {
  if (!PermissionsManager.canEditSignIn(user)) {
    throw new PermissionError("You don't have permission to create a sign-in form!");
  }
  await SignInFormDao.deleteSignIn(id);
};

export const allSignInForms = async (
  user: IdolMember
): Promise<{ readonly forms: SignInForm[] }> => {
  if (!PermissionsManager.canEditSignIn(user)) {
    return { forms: [] };
  }
  return { forms: await SignInFormDao.allSignInForms() };
};

export const signIn = async (
  id: string,
  user: IdolMember
): Promise<{ signedInAt: number; id: string }> => {
  const signedInAt = await SignInFormDao.signIn(id, user.email);
  return { id, signedInAt };
};
