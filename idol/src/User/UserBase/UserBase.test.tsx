import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserBase from './UserBase';

describe('<UserBase />', () => {
  test('it should mount', () => {
    render(<UserBase />);
    
    const userBase = screen.getByTestId('UserBase');

    expect(userBase).toBeInTheDocument();
  });
});