import React from 'react';
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import GamesBase from './GamesBase';

describe('<GamesBase />', () => {
  test('route /games', () => {
    const history = createMemoryHistory();
    const route = '/games';
    history.push(route);
    render(
      <Router history={history}>
        <GamesBase />
      </Router>
    );
  });
});
