import React from 'react';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import FormsBase from './FormsBase';

describe('<FormsBase />', () => {
  test('route /forms', () => {
    const history = createMemoryHistory();
    const route = '/forms';
    history.push(route);
    render(
      <Router history={history}>
        <FormsBase />
      </Router>
    );
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile Image')).toBeInTheDocument();
  });
});
