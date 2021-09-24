import React from 'react';
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import AdminBase from './AdminBase';

describe('<AdminBase />', () => {
  test('route /admin', () => {
    const history = createMemoryHistory();
    const route = '/admin';
    history.push(route);
    render(
      <Router history={history}>
        <AdminBase />
      </Router>
    );
  });
});
