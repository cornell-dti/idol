import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';
import FirestoreDataProvider from '../../Common/FirestoreDataProvider';

describe('<UserProfile />', () => {
  test('labels', () => {
    render(
      <FirestoreDataProvider>
        <UserProfile />
      </FirestoreDataProvider>
    );
    const userProfileImage = screen.getByTestId('UserProfileImage');

    expect(userProfileImage).toBeInTheDocument();
    expect(screen.getByText('Semester Joined')).toBeInTheDocument();
    expect(screen.getByText('Graduation')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Double Major')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
    expect(screen.getByText('College')).toBeInTheDocument();
    expect(screen.getByText('Hometown')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Coffee Chat Calendly *')).toBeInTheDocument();
  });
});
