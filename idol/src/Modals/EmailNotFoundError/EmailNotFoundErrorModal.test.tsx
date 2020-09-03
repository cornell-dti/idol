import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmailNotFoundErrorModal from './EmailNotFoundErrorModal';

describe('<EmailNotFoundErrorModal />', () => {
  test('it should mount', () => {
    render(<EmailNotFoundErrorModal />);
    
    const emailNotFoundErrorModal = screen.getByTestId('EmailNotFoundErrorModal');

    expect(emailNotFoundErrorModal).toBeInTheDocument();
  });
});