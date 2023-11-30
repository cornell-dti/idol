import { signInFormCollection, memberCollection } from '../firebase';
import { NotFoundError } from '../utils/errors';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

type SignInUser = {
  signedInAt: number;
  userDoc: IdolMember;
};

/**
 * Filters out sign-ins from users with the specified email.
 * @param users - An array of users who have signed in.
 * @param userEmail - The email address to filter out.
 * @returns An array of SignInUser objects excluding users with the specified email.
 */
async function filterSignIns(users, userEmail) {
  const prevSignIns: SignInUser[] = await Promise.all(
    users.map(async (obj) => ({
      signedInAt: obj.signedInAt,
      userDoc: await obj.user.get().then((doc) => doc.data() as IdolMember)
    }))
  ).then((results) => results as SignInUser[]);
  return users.filter((_, i) => prevSignIns[i].userDoc.email !== userEmail);
}

export default class SignInFormDao {
  /**
   * Retrieves a sign-in form with the specified ID.
   * @param id - The unique identifier for the sign-in form.
   * @returns The SignInForm object if found; otherwise, null.
   */
  static async getSignInForm(id: string): Promise<SignInForm | null> {
    const doc = await signInFormCollection.doc(id).get();
    const dbSignInForm = doc.data();
    if (!dbSignInForm) return null;
    return {
      ...dbSignInForm,
      prompt: dbSignInForm.prompt ? dbSignInForm.prompt : undefined,
      users: await Promise.all(
        dbSignInForm?.users.map(async (signInResponse) => ({
          ...signInResponse,
          user: await getMemberFromDocumentReference(signInResponse.user),
          response: signInResponse.response ? signInResponse.response : undefined
        }))
      )
    };
  }

  /**
   * Signs in a user to the specified form using their email.
   * @param id - The unique identifier for the sign-in form.
   * @param email - The email of the user signing in.
   * @param response - Optional response the user provides upon signing in.
   * @returns The timestamp indicating when the user signed in.
   * @throws {NotFoundError} If the sign-in form does not exist.
   */
  static async signIn(id: string, email: string, response?: string): Promise<number> {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    const form = formRef.data();
    if (form == null) throw new NotFoundError(`No form content in form with id '${id}' found.`);

    const signedInAtVal = Date.now();
    const userDoc = memberCollection.doc(email);
    const updatedSignIns = await filterSignIns(form.users, email);

    return formDoc
      .update({
        users: updatedSignIns.concat({
          signedInAt: signedInAtVal,
          user: userDoc,
          response: response || null
        })
      })
      .then((_) => signedInAtVal);
  }

  /**
   * Creates a new sign-in form with the specified parameters.
   * @param id - The unique identifier for the new sign-in form.
   * @param expireAt - The timestamp indicating when the form expires.
   * @param prompt - An optional prompt for users signing into the form.
   * @returns Promise that resolves when the sign-in form is created.
   */
  static async createSignIn(id: string, expireAt: number, prompt?: string): Promise<void> {
    const formDoc = signInFormCollection.doc(id);
    const signInForm = {
      createdAt: Date.now(),
      id,
      expireAt,
      users: [],
      prompt: prompt || null
    };
    await formDoc.set(signInForm);
  }

  /**
   * Deletes a sign-in form with the specified ID.
   * @param id - The unique identifier for the sign-in form to be deleted.
   * @returns Promise that resolves when the sign-in form is deleted.
   */
  static async deleteSignIn(id: string): Promise<void> {
    const formDoc = signInFormCollection.doc(id);
    await formDoc.delete();
  }

  /**
   * Retrieves all sign-in forms.
   * @returns An array of SignInForm objects.
   * @throws {NotFoundError} If a form reference is invalid or the form data is undefined.
   */
  static async allSignInForms(): Promise<SignInForm[]> {
    const docsRefs = signInFormCollection.listDocuments();
    return docsRefs.then((v) => {
      const filledForms = v.map(async (doc) => {
        const formRef = await doc.get();
        if (!formRef.exists) throw new NotFoundError(`This should be impossible. CODE: DTI-1`);
        const formData = formRef.data();
        if (formData === undefined)
          throw new NotFoundError(`This should be impossible. CODE: DTI-2`);
        const userProms = formData.users.map(async (u) => ({
          ...u,
          response: u.response ? u.response : undefined,
          user: await getMemberFromDocumentReference(u.user)
        }));
        const signIns = await Promise.all(userProms);
        return {
          ...formData,
          prompt: formData.prompt ? formData.prompt : undefined,
          users: signIns
        };
      });
      return Promise.all(filledForms);
    });
  }
}
