import { SignInForm } from '../dataTypes';
import { signInFormCollection, memberCollection } from '../firebase';
import { NotFoundError } from '../errors';
import MembersDao from './MembersDao';

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
  static async signIn(id: string, email: string): Promise<number> {
    const formDoc = signInFormCollection.doc(id);
    const formRef = await formDoc.get();
    const form = formRef.data();
    if (form == null) throw new NotFoundError(`No form content in form with id '${id}' found.`);

    const signedInAtVal = Date.now();
    const userDoc = memberCollection.doc(email);
    const updatedSignIns = await filterSignIns(form.users, email);

    return formDoc
      .update({
        users: updatedSignIns.concat({ signedInAt: signedInAtVal, user: userDoc })
      })
      .then((_) => signedInAtVal);
  }

  static async createSignIn(id: string, expireAt: number): Promise<void> {
    const formDoc = signInFormCollection.doc(id);
    await formDoc.set({ createdAt: Date.now(), id, expireAt, users: [] });
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
