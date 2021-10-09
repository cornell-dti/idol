import { SignInForm } from '../DataTypes';
import { signInFormCollection, memberCollection } from '../firebase';
import { NotFoundError, PermissionError } from '../errors';
import MembersDao from './MembersDao';

export default class SignInFormDao {
  static async signIn(id: string, email: string): Promise<number> {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    if (!formRef.exists) throw new NotFoundError(`No form with id '${id}' found.`);
    const form = formRef.data();
    if (form == null) throw new NotFoundError(`No form content in form with id '${id}' found.`);
    const signedInAtVal = Date.now();
    if (form.expireAt <= signedInAtVal)
      throw new PermissionError(`User is not allowed to sign into expired form with id '${id}.`);
    const userDoc = memberCollection.doc(email);
    const userRef = await userDoc.get();
    if (!userRef.exists) throw new NotFoundError(`No user with email '${email}' found.`);
    return formDoc
      .update({
        users: form.users.concat({ signedInAt: signedInAtVal, user: userDoc })
      })
      .then((_) => signedInAtVal);
  }

  static async createSignIn(id: string, expireAt: number): Promise<void> {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    if (formRef.exists) throw new NotFoundError(`A form with id '${id}' already exists!`);
    await formDoc.set({ createdAt: Date.now(), id, expireAt, users: [] });
  }

  static async deleteSignIn(id: string): Promise<void> {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    if (!formRef.exists) throw new NotFoundError(`No form with id '${id}' exists!`);
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
        const userProms = formData.users.map((u) => {
          const memberID = u.user.id;
          return MembersDao.getCurrentOrPastMemberByEmail(memberID).then((value) => {
            if (value === undefined)
              throw new NotFoundError(`This should be impossible. CODE: DTI-3`);
            return {
              signedInAt: u.signedInAt,
              user: value
            };
          });
        });
        const signIns = await Promise.all(userProms);
        return {
          ...formData,
          users: signIns
        };
      });
      return Promise.all(filledForms);
    });
  }
}
