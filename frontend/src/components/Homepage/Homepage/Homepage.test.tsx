import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Homepage from './Homepage';

jest.mock('../Banner/Banner', () => () => <div data-testid="Homepage" />);

test('Homepage renders', () => {
  const { getByTestId } = render(<Homepage />);
  expect(getByTestId(/Homepage/)).toBeInTheDocument();
});
