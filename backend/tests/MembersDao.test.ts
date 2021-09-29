const MembersDao = require('../src/dao/MembersDao').default;
const jaggerData = require('./data/jagger-profile.json');
const mockUsers = require('./data/mock-users.json');
const { approvedMemberCollection, memberCollection } = require('../src/firebase');

/* Cleanup database after running MembersDao tests */
afterAll(async () =>
  Promise.all(
    Object.keys(mockUsers).map(async (netid) => {
      const mockUser = mockUsers[netid];
      await MembersDao.deleteMember(mockUser.email);
      await approvedMemberCollection.doc(mockUser.email).delete();
      return mockUser;
    })
  )
);

test('Add new member', () => {
  const mockUser = mockUsers.mu1;
  return MembersDao.setMember(mockUser.email, mockUser).then(() => {
    MembersDao.getCurrentOrPastMemberByEmail(mockUser.email).then((member) => {
      expect(member).toEqual(mockUser);
    });
  });
});

test('Get member from past semester', () =>
  MembersDao.getCurrentOrPastMemberByEmail(jaggerData.email).then((pastMember) =>
    expect(pastMember).toEqual(jaggerData)
  ));

test('Approve member information changes', () => {
  const mockUser = mockUsers.mu2;
  return MembersDao.setMember(mockUser.email, mockUser).then(() => {
    MembersDao.approveMemberInformationChanges([mockUser.email]).then(() => {
      MembersDao.getAllMembers(true).then((allApprovedMembers) => {
        expect(allApprovedMembers.find((member) => member.email === mockUser.email)).toBeDefined();
      });
    });
  });
});

test('Revert member information changes', async () => {
  const mockUser = mockUsers.mu3;
  const mockUserRef = await MembersDao.setMember(mockUser.email, mockUser).then(() =>
    MembersDao.approveMemberInformationChanges([mockUser.email]).then(() =>
      MembersDao.updateMember(mockUser.email, { ...mockUser, major: 'Information Science' })
        .then(() => MembersDao.revertMemberInformationChanges([mockUser.email]))
        .then(() => memberCollection.doc(mockUser.email).get())
    )
  );
  const dbMockUser = mockUserRef.data();
  expect(dbMockUser.major).toEqual(mockUser.major);
});
