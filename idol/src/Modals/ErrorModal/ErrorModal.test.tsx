import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmailNotFoundErrorModal from './ErrorModal';

describe('<ErrorModal />', () => {
  test('it should mount', () => {
    render(<EmailNotFoundErrorModal />);

    const emailNotFoundErrorModal = screen.getByTestId('ErrorModal');

    expect(emailNotFoundErrorModal).toBeInTheDocument();
  });
});