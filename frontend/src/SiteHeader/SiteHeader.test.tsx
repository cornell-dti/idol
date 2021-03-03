import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SiteHeader from './SiteHeader';

describe('<SiteHeader />', () => {
  test('it should mount', () => {
    render(<SiteHeader />);

    const siteHeader = screen.getByTestId('SiteHeader');

    expect(siteHeader).toBeInTheDocument();
  });
});
