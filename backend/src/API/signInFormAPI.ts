import { Router } from 'express';
import SignInFormDao from '../dao/SignInFormDao';
import { PermissionError, BadRequestError, NotFoundError } from '../utils/errors';
import { signInFormCollection, memberCollection } from '../firebase';
import PermissionsManager from '../utils/permissionsManager';
import { loginCheckedGet, loginCheckedPost } from '../utils/auth';

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
  prompt: string | undefined,
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
  await SignInFormDao.createSignIn(id, expireAt, prompt);
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
  response: string | undefined,
  user: IdolMember
): Promise<{ signedInAt: number; id: string }> => {
  const signInForm = await SignInFormDao.getSignInForm(id);
  if (!signInForm) throw new NotFoundError(`No form with id '${id}' found.`);
  if (signInForm.expireAt <= Date.now()) {
    throw new BadRequestError(`User is not allowed to sign into expired form with id '${id}.`);
  }
  if (signInForm.prompt && !response) {
    throw new BadRequestError(`Sign-in request is missing a response to the prompt`);
  }
  const userDoc = memberCollection.doc(user.email);
  const userRef = await userDoc.get();
  if (!userRef.exists) {
    throw new NotFoundError(`No user with email '${user.email}' found.`);
  }

  const signedInAt = await SignInFormDao.signIn(id, user.email, response);
  return { id, signedInAt };
};

export const getSignInPrompt = async (id: string): Promise<string | undefined> => {
  const signInForm = await SignInFormDao.getSignInForm(id);
  if (!signInForm) throw new NotFoundError(`Sign-in form with id ${id} does not exist!`);
  return signInForm.prompt;
};

export const signInRouter = Router();
loginCheckedPost(signInRouter, '/signInExists', async (req, _) => ({
  exists: await signInFormExists(req.body.id)
}));
loginCheckedPost(signInRouter, '/signInExpired', async (req, _) => ({
  expired: await signInFormExpired(req.body.id)
}));
loginCheckedPost(signInRouter, '/signInCreate', async (req, user) =>
  createSignInForm(req.body.id, req.body.expireAt, req.body.prompt, user)
);
loginCheckedPost(signInRouter, '/signInDelete', async (req, user) => {
  await deleteSignInForm(req.body.id, user);
  return {};
});
loginCheckedPost(signInRouter, '/signIn', async (req, user) =>
  signIn(req.body.id, req.body.response, user)
);
loginCheckedPost(signInRouter, '/signInAll', async (_, user) => allSignInForms(user));
loginCheckedGet(signInRouter, '/signInPrompt/:id', async (req, _) => ({
  prompt: await getSignInPrompt(req.params.id)
}));
