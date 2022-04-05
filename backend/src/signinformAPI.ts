import SignInFormDao from './dao/SignInFormDao';
import { PermissionError, BadRequestError, NotFoundError } from './errors';
import { signInFormCollection, memberCollection } from './firebase';
import PermissionsManager from './permissions';

const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await signInFormCollection.doc(id).get()).exists;

export const signInFormExpired = async (id: string): Promise<boolean> => {
  const expireAt = await (await signInFormCollection.doc(id).get()).data()?.expireAt;
  if (expireAt === undefined) {
    return false;
  }
  return expireAt <= Date.now();
};

export const signInFormExists: (id: string) => Promise<boolean> = checkIfDocExists;

export const createSignInForm = async (
  id: string,
  expireAt: number,
  user: IdolMember
): Promise<{ id: string; createdAt: number; expireAt: number }> => {
  const canEdit = await PermissionsManager.canEditSignIn(user);
  if (!canEdit) {
    throw new PermissionError("You don't have permission to create a sign-in form!");
  }
  if (expireAt <= Date.now()) {
    throw new BadRequestError('Invalid Date: Expiry Date cannot be in the past!');
  }
  const formExists = await signInFormExists(id);
  if (formExists) {
    throw new NotFoundError(`A form with id '${id}' already exists!`);
  }
  await SignInFormDao.createSignIn(id, expireAt);
  return { id, createdAt: Date.now(), expireAt };
};

export const deleteSignInForm = async (id: string, user: IdolMember): Promise<void> => {
  const canEdit = await PermissionsManager.canEditSignIn(user);
  if (!canEdit) {
    throw new PermissionError("You don't have permission to delete a sign-in form!");
  }
  const formExists = await signInFormExists(id);
  if (!formExists) {
    throw new NotFoundError(`No form with id '${id}' found.`);
  }
  await SignInFormDao.deleteSignIn(id);
};

export const allSignInForms = async (
  user: IdolMember
): Promise<{ readonly forms: SignInForm[] }> => {
  const canEdit = await PermissionsManager.canEditSignIn(user);
  if (!canEdit) {
    return { forms: [] };
  }
  return { forms: await SignInFormDao.allSignInForms() };
};

export const signIn = async (
  id: string,
  user: IdolMember
): Promise<{ signedInAt: number; id: string }> => {
  const formExists = await signInFormExists(id);
  if (!formExists) {
    throw new NotFoundError(`No form with id '${id}' found.`);
  }
  const formExpired = await signInFormExpired(id);
  if (formExpired) {
    throw new BadRequestError(`User is not allowed to sign into expired form with id '${id}.`);
  }
  const userDoc = memberCollection.doc(user.email);
  const userRef = await userDoc.get();
  if (!userRef.exists) {
    throw new NotFoundError(`No user with email '${user.email}' found.`);
  }

  const signedInAt = await SignInFormDao.signIn(id, user.email);
  return { id, signedInAt };
};
