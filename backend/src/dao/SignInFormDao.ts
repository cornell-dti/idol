import { DBSignInForm } from '../DataTypes';
import { signInFormCollection, memberCollection } from '../firebase';
import { NotFoundError } from '../errors';

export default class SignInFormDao {
  static async signIn(id: string, email: string): Promise<boolean> {
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
    return formDoc
      .update({
        users: form.users.filter((m) => m.id !== userDoc.id).concat(userDoc)
      })
      .then((v) => true)
      .catch((r) => {
        throw r;
      });
  }
}
