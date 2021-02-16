import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Banner from './Banner';

type BannerProps = React.ComponentProps<typeof Banner>;
let props: BannerProps = {
  title: 'Test Title',
  message: 'Test Message'
}

describe('<Banner />', () => {
  test('test mounting and props', () => {
    render(<Banner {...props} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });
});