import MembersDao from '../src/dao/MembersDao';
import { approvedMemberCollection, memberCollection } from '../src/firebase';
import { fakeIdolMember } from './data/createData';
import jaggerData from './data/jagger-profile.json';

const mockUsers = {
  mu1: fakeIdolMember(),
  mu2: fakeIdolMember(),
  mu3: fakeIdolMember()
};

const membersDao = new MembersDao();

/* Cleanup database after running MembersDao tests */
afterAll(async () =>
  Promise.all(
    Object.keys(mockUsers).map(async (netid) => {
      const mockUser = mockUsers[netid];
      await membersDao.deleteMember(mockUser.email);
      await approvedMemberCollection.doc(mockUser.email).delete();
      return mockUser;
    })
  )
);

test('Add new member', () => {
  const mockUser = mockUsers.mu1 as IdolMember;
  return membersDao.setMember(mockUser.email, mockUser).then(() => {
    MembersDao.getCurrentOrPastMemberByEmail(mockUser.email).then((member) => {
      expect(member).toEqual(mockUser);
    });
  });
});

test('Get member from past semester', () =>
  MembersDao.getCurrentOrPastMemberByEmail(jaggerData.email).then(
    (pastMember) => expect(pastMember.email).toEqual(jaggerData.email) // cannot deprecate jaggerData yet
  ));

test('Approve member information changes', () => {
  const mockUser = mockUsers.mu2 as IdolMember;
  return membersDao.setMember(mockUser.email, mockUser).then(() => {
    MembersDao.approveMemberInformationChanges([mockUser.email]).then(() => {
      MembersDao.getAllMembers(true).then((allApprovedMembers) => {
        expect(allApprovedMembers.find((member) => member.email === mockUser.email)).toBeDefined();
      });
    });
  });
});

test('Revert member information changes', async () => {
  const mockUser = mockUsers.mu3 as IdolMember;
  const mockUserRef = await membersDao.setMember(mockUser.email, mockUser).then(() =>
    MembersDao.approveMemberInformationChanges([mockUser.email]).then(() =>
      membersDao
        .updateMember(mockUser.email, { ...mockUser, major: 'Information Science' })
        .then(() => MembersDao.revertMemberInformationChanges([mockUser.email]))
        .then(() => memberCollection.doc(mockUser.email).get())
    )
  );
  const dbMockUser = mockUserRef.data();
  expect(dbMockUser.major).toEqual(mockUser.major);
});

test('Get teams', async () => {
  // all subteams from m1,m2,m3
  const teamsList = [
    ...mockUsers.mu1.subteams,
    ...mockUsers.mu2.subteams,
    ...mockUsers.mu3.subteams
  ];

  const teamsReceived = await MembersDao.getAllTeams().then((teams) => teams.map((t) => t.name));
  expect(teamsReceived.sort()).toEqual(expect.arrayContaining(teamsList.sort()));
});
