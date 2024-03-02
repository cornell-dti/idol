import { faker } from '@faker-js/faker';

/** Get random number in range [`a`,`b`], inclusive. */
const getRandomInt = (a, b) => {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomBoolean = () => getRandomInt(0, 1) === 0;

/** Get year string. Ex. "2023" */
const fakeYear = (): string => {
  const year = faker.date.future().getFullYear();
  return year.toString();
};

/** Get list of 1 to 3 fake subteams. */
const fakeSubteams = (): string[] => {
  // 1 to 3 length of random words
  const length = getRandomInt(0, 3);
  const subteams: string[] = [];
  /* eslint-disable no-plusplus */
  for (let i = 0; i < length; i++) {
    subteams.push(faker.lorem.word());
  }

  return subteams;
};

const fakeRoleObject = () => {
  const roles: Role[] = ['lead', 'tpm', 'pm', 'developer', 'designer', 'business'];
  const role_descriptions: RoleDescription[] = [
    'Lead',
    'Technical PM',
    'Product Manager',
    'Developer',
    'Designer',
    'Business Analyst'
  ];

  // pick one item at random from each list
  const role = roles[Math.floor(Math.random() * roles.length)];
  const roleDescription = role_descriptions[Math.floor(Math.random() * role_descriptions.length)];
  return { role, roleDescription };
};

/** Create fake Idol member */
export const fakeIdolMember = (): IdolMember => {
  const member = {
    netid: 'test123', // to easily be able to find fake members if needed
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    pronouns: faker.hacker.noun(),
    graduation: fakeYear(),
    major: faker.lorem.word(),
    hometown: faker.address.city(),
    about: faker.lorem.paragraph(),
    subteams: fakeSubteams(),
    ...fakeRoleObject()
  };
  return member;
};

/** Create a fake TeamEventAttendace object. */
export const fakeTeamEventAttendance = (): TeamEventAttendance => {
  const TEA = {
    member: fakeIdolMember(),
    hoursAttended: getRandomInt(1, 5),
    image: '',
    eventUuid: faker.datatype.uuid(),
    pending: true,
    uuid: faker.datatype.uuid()
  };
  return TEA;
};

/** Create a fake TeamEvent object. */
export const fakeTeamEvent = (): TeamEvent => {
  const TE = {
    name: 'testteamevent', // to easily be able to tell fake TeamEvents if needed
    date: faker.date.past().toLocaleDateString(),
    numCredits: getRandomInt(1, 3).toString(),
    hasHours: getRandomBoolean(),
    requests: [fakeTeamEventAttendance()],
    attendees: [],
    uuid: faker.datatype.uuid(),
    isInitiativeEvent: getRandomBoolean()
  };
  return TE;
};

/** Get list of 1 to 3 fake github links. */
const fakePRs = (): PullRequestSubmission[] => {
  const length = getRandomInt(0, 3);
  const prs: PullRequestSubmission[] = [];
  /* eslint-disable no-plusplus */
  for (let i = 0; i < length; i++) {
    const owner = faker.lorem.word();
    const repo = faker.lorem.word();
    const pullNumber = getRandomInt(1, 999);
    prs.push({ url: `https://github.com/${owner}/${repo}/pull/${pullNumber}`, status: 'pending' });
  }

  return prs;
};

/** Create a fake Dev Submission */
export const fakeDevPortfolioSubmission = (): DevPortfolioSubmission => {
  const DPSub: DevPortfolioSubmission = {
    member: fakeIdolMember(),
    openedPRs: fakePRs(),
    reviewedPRs: fakePRs(),
    status: 'pending'
  };
  return DPSub;
};

/** Create a fake Dev Portfolio */
export const fakeDevPortfolio = (): DevPortfolio => {
  const DP = {
    name: 'testdevportfolio',
    deadline: Date.now() + 10 * 86400000,
    lateDeadline: Date.now() + 15 * 86400000, // 10 days in the future
    earliestValidDate: Date.parse('01 May 2022 00:00:00 GMT'),
    submissions: [],
    uuid: faker.datatype.uuid()
  };
  return DP;
};

/** Create fake Dev Portfolios for portfolio creation test */
export const fakeCreateDevPortfolio = (): [DevPortfolio, DevPortfolio] => {
  const uuid = faker.datatype.uuid();
  const input = {
    name: 'testdevportfolio',
    deadline: 1679260752410, // 2023-03-19T21:19:12.410Z
    lateDeadline: 1679692752410, // 2023-03-24T21:19:12.410Z
    earliestValidDate: 1651363200020, // 2022-05-01T00:00:00.020Z
    submissions: [],
    uuid
  };
  const output = {
    name: 'testdevportfolio',
    deadline: 1679284799999, // 2023-03-20T03:59:59.999Z (11:59:59 EST)
    lateDeadline: 1679716799999, // 2023-03-25T03:59:59.999Z (11:59:59 EST)
    earliestValidDate: 1651291200000, // 2022-04-30T04:00:00.000Z
    submissions: [],
    uuid
  };
  return [input, output];
};
