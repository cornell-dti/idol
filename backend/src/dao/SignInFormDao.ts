import { signInFormCollection, memberCollection } from '../firebase';
import { NotFoundError } from '../utils/errors';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

type SignInUser = {
  signedInAt: number;
  userDoc: IdolMember;
};

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

  static async deleteSignIn(id: string): Promise<void> {
    const formDoc = signInFormCollection.doc(id);
    await formDoc.delete();
  }

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
