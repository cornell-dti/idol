import React from 'react';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import UserBase from './UserBase';

describe('<UserBase />', () => {
  test('route /users', () => {
    const history = createMemoryHistory()
    const route = '/users'
    history.push(route)
    render(
      <Router history={history}>
        <UserBase />
      </Router>
    )
    expect(screen.getByText("Edit Users")).toBeInTheDocument();
    expect(screen.getByText("Edit Teams")).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Edit Profile Image")).toBeInTheDocument();
  });
});


