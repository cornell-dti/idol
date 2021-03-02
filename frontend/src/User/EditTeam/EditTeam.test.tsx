import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditTeam from './EditTeam';

describe('<EditTeam />', () => {
  test('it should mount', () => {
    render(<EditTeam />);

    const editTeam = screen.getByTestId('EditTeam');

    expect(editTeam).toBeInTheDocument();
  });
});
