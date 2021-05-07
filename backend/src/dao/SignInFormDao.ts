import { DBSignInForm } from '../DataTypes';
import { signInFormCollection, memberCollection } from '../firebase';
import { NotFoundError } from '../errors';

export default class SignInFormDao {
  static async signIn(id: string, email: string): Promise<number> {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    if (!formRef.exists)
      throw new NotFoundError(`No form with id '${id}' found.`);
    const form: DBSignInForm | undefined = formRef.data();
    if (form === undefined)
      throw new NotFoundError(`No form content in form with id '${id}' found.`);
    const userDoc = memberCollection.doc(email);
    const userRef = await userDoc.get();
    if (!userRef.exists)
      throw new NotFoundError(`No user with email '${email}' found.`);
    const signedInAtVal = Date.now();
    return formDoc
      .update({
        users: form.users.concat({ signedInAt: signedInAtVal, user: userDoc })
      })
      .then((_) => signedInAtVal)
      .catch((r) => {
        throw r;
      });
  }

  static async createSignIn(id: string) {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    if (formRef.exists)
      throw new NotFoundError(`A form with id '${id}' already exists!`);
    return formDoc.set({
      createdAt: Date.now(),
      id,
      users: []
    }).then((r) => true).catch((r) => {
      throw r;
    });
  }
}
