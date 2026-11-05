import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import CoffeeChatCategories from './CoffeeChatCategories';

jest.mock('../../../API/CoffeeChatAPI', () => ({
  __esModule: true,
  default: {
    getCoffeeChatBingoBoard: jest.fn(),
    getCoffeeChatCategoriesByUser: jest.fn(),
    submitCoffeeChatCategories: jest.fn()
  }
}));

const mockedCoffeeChatAPI = CoffeeChatAPI as jest.Mocked<typeof CoffeeChatAPI>;

describe('<CoffeeChatCategories />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows a load failure and no submit button when categories fail to load', async () => {
    mockedCoffeeChatAPI.getCoffeeChatBingoBoard.mockRejectedValue(new Error('network'));
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue([]);

    render(<CoffeeChatCategories />);

    expect(await screen.findByText('Failed to load coffee chat categories.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    expect(mockedCoffeeChatAPI.submitCoffeeChatCategories).not.toHaveBeenCalled();
  });

  test('shows the categories and a submit button when they load', async () => {
    mockedCoffeeChatAPI.getCoffeeChatBingoBoard.mockResolvedValue([
      ['a newbie', 'plays an instrument']
    ]);
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue(['a newbie']);

    render(<CoffeeChatCategories />);

    expect(await screen.findByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByText('a newbie')).toBeInTheDocument();
    expect(screen.getByText('plays an instrument')).toBeInTheDocument();
    expect(screen.queryByText('Failed to load coffee chat categories.')).not.toBeInTheDocument();
  });
});
