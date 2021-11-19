import MembersDao from '../src/dao/MembersDao';
import SignInFormDao from '../src/dao/SignInFormDao';
import { SignInForm } from '../src/DataTypes';
import { approvedMemberCollection } from '../src/firebase';
import mockForms from './data/mock-signin.json';

/* Adding mock user for testing sign-ins */
beforeAll(async () => {
  const mockUser = mockForms.users.mus1 as IdolMember;
  await MembersDao.setMember(mockUser.email, mockUser);
});

/* Cleanup database after running SignInFormDao tests */
afterAll(async () => {
  Promise.all(
    mockForms.allMockIds.map(async (id) => {
      await SignInFormDao.deleteSignIn(id);
    })
  );
  await MembersDao.deleteMember(mockForms.users.mus1.email);
  await approvedMemberCollection.doc(mockForms.users.mus1.email).delete();
});

test('Create new sign-in form', async () => {
  const openForm = mockForms.openSignin as SignInForm;
  return SignInFormDao.createSignIn(openForm.id, openForm.expireAt).then(async () => {
    const allForms = await SignInFormDao.allSignInForms();
    expect(allForms).toContainEqual(expect.objectContaining(openForm));
  });
});

test('Sign in into an open form', async () => {
  const openForm = mockForms.openSignin as SignInForm;
  await SignInFormDao.signIn(openForm.id, mockForms.users.mus1.email);

  const formData = await SignInFormDao.allSignInForms();
  const userData = formData.filter((forms) => forms.id === openForm.id)[0];
  expect(userData.users).toContainEqual(expect.objectContaining({ user: mockForms.users.mus1 }));
});

test('Sign in attempted for an expired form', async () => {
  const expiredForm = mockForms.expiredSignin as SignInForm;
  await SignInFormDao.createSignIn(expiredForm.id, expiredForm.expireAt);
  await expect(() =>
    SignInFormDao.signIn(expiredForm.id, mockForms.users.mus1.email)
  ).rejects.toThrow();
});

test('Sign in attempted for an invalid id', async () => {
  const invalidId = 'invalid-id';
  await expect(() => SignInFormDao.signIn(invalidId, mockForms.users.mus1.email)).rejects.toThrow();
});
