import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Homepage from './Homepage';

describe('<Homepage />', () => {
  test('it should mount', () => {
    render(<Homepage />);
    
    const homepage = screen.getByTestId('Homepage');

    expect(homepage).toBeInTheDocument();
  });
});