import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue({
      categories: [],
      submitted: false
    });

    render(<CoffeeChatCategories />);

    expect(await screen.findByText('Failed to load coffee chat categories.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    expect(mockedCoffeeChatAPI.submitCoffeeChatCategories).not.toHaveBeenCalled();
  });

  test('shows the categories and a submit button when they load', async () => {
    mockedCoffeeChatAPI.getCoffeeChatBingoBoard.mockResolvedValue([
      ['a newbie', 'plays an instrument']
    ]);
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue({
      categories: ['a newbie'],
      submitted: false
    });

    render(<CoffeeChatCategories />);

    expect(await screen.findByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByText('a newbie')).toBeInTheDocument();
    expect(screen.getByText('plays an instrument')).toBeInTheDocument();
    expect(screen.queryByText('Failed to load coffee chat categories.')).not.toBeInTheDocument();
  });

  test('shows a submitted response without the form', async () => {
    mockedCoffeeChatAPI.getCoffeeChatBingoBoard.mockResolvedValue([['a newbie']]);
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue({
      categories: ['a newbie'],
      submitted: true
    });

    render(<CoffeeChatCategories />);

    expect(await screen.findByText(/already submitted/i)).toBeInTheDocument();
    expect(screen.getByText('a newbie')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  test('locks the form after a successful submit', async () => {
    mockedCoffeeChatAPI.getCoffeeChatBingoBoard.mockResolvedValue([
      ['a newbie', 'plays an instrument']
    ]);
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue({
      categories: ['a newbie'],
      submitted: false
    });
    mockedCoffeeChatAPI.submitCoffeeChatCategories.mockResolvedValue();

    render(<CoffeeChatCategories />);
    fireEvent.click(await screen.findByRole('button', { name: 'Submit' }));

    expect(await screen.findByText(/already submitted/i)).toBeInTheDocument();
    expect(screen.getByText('a newbie')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    expect(mockedCoffeeChatAPI.submitCoffeeChatCategories).toHaveBeenCalledWith(['a newbie']);
  });

  test('shows an empty submitted response without the form', async () => {
    mockedCoffeeChatAPI.getCoffeeChatBingoBoard.mockResolvedValue([['a newbie']]);
    mockedCoffeeChatAPI.getCoffeeChatCategoriesByUser.mockResolvedValue({
      categories: [],
      submitted: true
    });

    render(<CoffeeChatCategories />);

    expect(await screen.findByText('You are not listed on any categories.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
  });
});
