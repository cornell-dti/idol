import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Homepage from './Homepage';

jest.mock('../Banner/Banner', () => () => <div data-testid="banner" />);
jest.mock('./Spotlight/Spotlight', () => () => <div data-testid="spotlight" />);

test('Homepage renders banner', () => {
  const { getByTestId } = render(<Homepage />);
  expect(getByTestId(/banner/)).toBeInTheDocument();
});

test('Homepage renders spotlight', () => {
  const { getByTestId } = render(<Homepage />);
  expect(getByTestId(/spotlight/)).toBeInTheDocument();
});