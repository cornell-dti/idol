import MembersDao from '../src/dao/MembersDao';
import SignInFormDao from '../src/dao/SignInFormDao';
import { SignInForm } from '../src/DataTypes';
import { approvedMemberCollection } from '../src/firebase';
import mockForms from './data/mock-signin.json';
import mockUsers from './data/mock-users.json';

/* Adding mock user for testing sign-ins */
beforeAll(async () => {
  const mockUser = mockUsers.mu1 as IdolMember;
  await MembersDao.setMember(mockUser.email, mockUser);
});

/* Cleanup database after running SignInFormDao tests */
afterAll(async () => {
  Promise.all(
    mockForms.allMockIds.map(async (id) => {
      await SignInFormDao.deleteSignIn(id);
    })
  );
  await MembersDao.deleteMember(mockUsers.mu1.email);
  await approvedMemberCollection.doc(mockUsers.mu1.email).delete();
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
  await SignInFormDao.signIn(openForm.id, mockUsers.mu1.email);

  const formData = await SignInFormDao.allSignInForms();
  const userData = formData.filter((forms) => forms.id === openForm.id)[0];
  expect(userData.users).toContainEqual(expect.objectContaining({ user: mockUsers.mu1 }));
});

test('Sign in attempted for an expired form', async () => {
    const expiredForm = mockForms.expiredSignin as SignInForm;
    await SignInFormDao.createSignIn(expiredForm.id, expiredForm.expireAt);
    await expect(() => SignInFormDao.signIn(expiredForm.id, mockUsers.mu1.email)).rejects.toThrow();
})

test('Sign in attempted for an invalid id', async () => {
    const invalidId = 'invalid-id'
    await expect(() => SignInFormDao.signIn(invalidId, mockUsers.mu1.email)).rejects.toThrow();
})