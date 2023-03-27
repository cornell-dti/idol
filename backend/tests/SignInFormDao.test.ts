import MembersDao from '../src/dao/MembersDao';
import SignInFormDao from '../src/dao/SignInFormDao';
import { approvedMemberCollection } from '../src/firebase';
import { fakeIdolMember } from './data/createData';
import mockForms from './data/mock-signin.json';

const users = {
  mu1: fakeIdolMember()
};

const membersDao = new MembersDao();

/* Adding mock user for testing sign-ins */
beforeAll(async () => {
  const mockUser = users.mu1 as IdolMember;
  await membersDao.setMember(mockUser.email, mockUser);
});

/* Cleanup database after running SignInFormDao tests */
afterAll(async () => {
  Promise.all(
    mockForms.allMockIds.map(async (id) => {
      await SignInFormDao.deleteSignIn(id);
    })
  );
  await membersDao.deleteMember(users.mu1.email);
  await approvedMemberCollection.doc(users.mu1.email).delete();
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
  await SignInFormDao.signIn(openForm.id, users.mu1.email);

  const formData = await SignInFormDao.allSignInForms();
  const userData = formData.filter((forms) => forms.id === openForm.id)[0];
  expect(userData.users).toContainEqual(expect.objectContaining({ user: users.mu1 }));
});

test('Sign in attempted for an invalid id', async () => {
  const invalidId = 'invalid-id';
  await expect(() => SignInFormDao.signIn(invalidId, users.mu1.email)).rejects.toThrow();
});
