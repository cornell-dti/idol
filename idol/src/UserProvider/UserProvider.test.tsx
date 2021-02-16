import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProvider from './UserProvider';

describe('<UserProvider />', () => {
  test('it should mount', () => {
    render(
      <UserProvider>
        <div data-testid="UserProvider" />
      </UserProvider>
    );

    const userProvider = screen.getByTestId('UserProvider');

    expect(userProvider).toBeInTheDocument();
  });
});
