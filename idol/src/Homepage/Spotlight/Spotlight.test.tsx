import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Spotlight from './Spotlight';

describe('<Spotlight />', () => {
  test('it should mount', () => {
    render(<Spotlight />);
    
    const spotlight = screen.getByTestId('Spotlight');

    expect(spotlight).toBeInTheDocument();
  });
});