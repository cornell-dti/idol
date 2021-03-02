import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Search from './Search';

describe('<Search />', () => {
  test('it should mount', () => {
    render(
      <Search
        source={[]}
        resultRenderer={() => <div />}
        matchChecker={() => false}
        selectCallback={(v) => {
          // Do nothing
        }}
      />
    );

    const search = screen.getByTestId('Search');

    expect(search).toBeInTheDocument();
  });
});
