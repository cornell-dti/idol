import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddUser from './AddUser';

describe('<AddUser />', () => {
  test('it should mount', () => {
    render(<AddUser />);
    
    const addUser = screen.getByTestId('AddUser');

    expect(addUser).toBeInTheDocument();
  });
});