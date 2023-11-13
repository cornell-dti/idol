import SignInFormDao from '../dao/SignInFormDao';
import { PermissionError, BadRequestError, NotFoundError } from '../utils/errors';
import { signInFormCollection, memberCollection } from '../firebase';
import PermissionsManager from '../utils/permissionsManager';

/**
 * Checks if a document with the given ID exists in the signInFormCollection.
 * @param {string} id - The ID of the document to check.
 * @returns {Promise<boolean>} - True if the document exists, false otherwise.
 */
const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await signInFormCollection.doc(id).get()).exists;

/**
 * Determines if a sign-in form has expired based on its ID.
 * @param {string} id - The ID of the sign-in form.
 * @returns {Promise<boolean>} - True if the form has expired, false otherwise.
 */
export const signInFormExpired = async (id: string): Promise<boolean> => {
  const expireAt = await (await signInFormCollection.doc(id).get()).data()?.expireAt;
  if (expireAt === undefined) {
    return false;
  }
  return expireAt <= Date.now();
};

export const signInFormExists: (id: string) => Promise<boolean> = checkIfDocExists;

/**
 * Creates a new sign-in form with the specified details.
 * @param {string} id - The ID for the new form.
 * @param {number} expireAt - The expiration timestamp for the form.
 * @param {string | undefined} prompt - The prompt for the sign-in, if any.
 * @param {IdolMember} user - The user creating the form.
 * @returns {Promise<{id: string; createdAt: number; expireAt: number}>} - Details of the created form.
 * @throws {PermissionError} - If the user lacks permission to create the form.
 * @throws {BadRequestError} - If the expiry date is invalid.
 * @throws {NotFoundError} - If a form with the same ID already exists.
 */
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

/**
 * Deletes a sign-in form based on its ID.
 * @param {string} id - The ID of the form to delete.
 * @param {IdolMember} user - The user attempting to delete the form.
 * @returns {Promise<void>}
 * @throws {PermissionError} - If the user lacks permission to delete the form.
 * @throws {NotFoundError} - If no form with the specified ID is found.
 */
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

/**
 * Retrieves all sign-in forms accessible to the given user.
 * @param {IdolMember} user - The user requesting the forms.
 * @returns {Promise<{readonly forms: SignInForm[]}>} - A list of sign-in forms.
 */
export const allSignInForms = async (
  user: IdolMember
): Promise<{ readonly forms: SignInForm[] }> => {
  const canEdit = await PermissionsManager.canEditSignIn(user);
  if (!canEdit) {
    return { forms: [] };
  }
  return { forms: await SignInFormDao.allSignInForms() };
};

/**
 * Handles the signing-in process for a user to a specific form.
 * @param {string} id - The ID of the sign-in form.
 * @param {string | undefined} response - The user's response to the sign-in prompt, if any.
 * @param {IdolMember} user - The user attempting to sign in.
 * @returns {Promise<{signedInAt: number; id: string}>} - Details of the sign-in.
 * @throws {NotFoundError} - If no form with the specified ID is found.
 * @throws {BadRequestError} - If the form is expired or the response is missing when required.
 */
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

/**
 * Retrieves the prompt of a specific sign-in form.
 * @param {string} id - The ID of the sign-in form.
 * @returns {Promise<string | undefined>} - The prompt of the form, if it exists.
 * @throws {NotFoundError} - If no form with the specified ID is found.
 */
export const getSignInPrompt = async (id: string): Promise<string | undefined> => {
  const signInForm = await SignInFormDao.getSignInForm(id);
  if (!signInForm) throw new NotFoundError(`Sign-in form with id ${id} does not exist!`);
  return signInForm.prompt;
};
