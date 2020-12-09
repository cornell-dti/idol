import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfileImage from './UserProfileImage';

describe('<UserProfileImage />', () => {
  test('it should mount', () => {
    render(<UserProfileImage />);

    const userProfileImage = screen.getByTestId('UserProfileImage');

    expect(userProfileImage).toBeInTheDocument();
  });
});