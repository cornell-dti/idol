import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import CoffeeChatDetails from './CoffeeChatDetails';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { category: 'Is a DTI newbie' }
  })
}));

jest.mock('../../../API/CoffeeChatAPI', () => ({
  __esModule: true,
  default: {
    getAllCoffeeChats: jest.fn(),
    runAutoChecker: jest.fn(),
    updateCoffeeChat: jest.fn()
  }
}));

const mockedCoffeeChatAPI = CoffeeChatAPI as jest.Mocked<typeof CoffeeChatAPI>;

const member = (firstName: string, lastName: string, netid: string): IdolMember => ({
  firstName,
  lastName,
  netid,
  email: `${netid}@cornell.edu`,
  pronouns: '',
  semesterJoined: 'FA26',
  graduation: '',
  major: '',
  hometown: '',
  about: '',
  subteams: [],
  role: 'developer',
  roleDescription: 'Developer'
});

const failMessage = "Martha Khusid does not meet the category 'Is a DTI newbie'";

const coffeeChat = (
  memberMeetsCategory: MemberMeetsCategoryStatus,
  errorMessage = ''
): CoffeeChat => ({
  uuid: 'chat-1',
  submitter: member('Casey', 'Wang', 'cw945'),
  otherMember: member('Martha', 'Khusid', 'mk2699'),
  isNonIDOLMember: false,
  slackLink: 'https://example.com',
  category: 'Is a DTI newbie',
  status: 'pending',
  date: 1,
  isArchived: false,
  memberMeetsCategory,
  errorMessage
});

describe('<CoffeeChatDetails />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('keeps the autochecker result when a chat reload is still in flight', async () => {
    const failedChat = coffeeChat('fail', failMessage);
    const passedChat = coffeeChat('pass');
    let releaseStaleReload: ((chats: CoffeeChat[]) => void) | undefined;
    let loadCount = 0;

    mockedCoffeeChatAPI.getAllCoffeeChats.mockImplementation(
      () =>
        new Promise((resolve) => {
          loadCount += 1;
          if (loadCount === 1) {
            resolve([failedChat]);
            return;
          }
          releaseStaleReload = resolve;
        })
    );
    mockedCoffeeChatAPI.runAutoChecker.mockResolvedValue(passedChat);

    render(<CoffeeChatDetails />);

    expect(await screen.findByText(failMessage)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Re-run autochecker' }));

    await waitFor(() => expect(screen.queryByText(failMessage)).not.toBeInTheDocument());

    releaseStaleReload?.([failedChat]);

    await waitFor(() => expect(mockedCoffeeChatAPI.runAutoChecker).toHaveBeenCalledWith('chat-1'));
    expect(screen.queryByText(failMessage)).not.toBeInTheDocument();
    expect(mockedCoffeeChatAPI.getAllCoffeeChats).toHaveBeenCalledTimes(1);
  });
});
