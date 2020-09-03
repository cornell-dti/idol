import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignIn from './SignIn';

describe('<SignIn />', () => {
  test('it should mount', () => {
    render(<SignIn />);
    
    const signIn = screen.getByTestId('SignIn');

    expect(signIn).toBeInTheDocument();
  });
});