import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileImageEditor from './ProfileImageEditor';

describe('<ProfileImageEditor />', () => {
  test('it should mount', () => {
    render(<ProfileImageEditor />);

    const profileImageEditor = screen.getByTestId('ProfileImageEditor');

    expect(profileImageEditor).toBeInTheDocument();
  });
});