import SignInFormDao from './dao/SignInFormDao';
import { PermissionError } from './errors';
import { signInFormCollection } from './firebase';
import { PermissionsManager } from './permissions';

const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await signInFormCollection.doc(id).get()).exists;

export const signInFormExpired = async (id: string): Promise<boolean> => {
  const expireAt = await (await signInFormCollection.doc(id).get()).data()?.expireAt;
  if (expireAt === undefined) {
    return false;
  }
  return expireAt <= new Date().getTime();
};

export const signInFormExists: (id: string) => Promise<boolean> = checkIfDocExists;

export const createSignInForm = async (
  id: string,
  expireAt: number,
  user: IdolMember
): Promise<{ id: string; createdAt: number; expireAt: number }> => {
  if (!PermissionsManager.canEditSignIn(user)) {
    throw new PermissionError("You don't have permission to create a sign-in form!");
  }
  await SignInFormDao.createSignIn(id, expireAt);
  return { id, createdAt: Date.now(), expireAt };
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
