import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

test('resets the persistent content panel when navigating, including between detail pages and back', () => {
  const shell = (pageKey: string) => (
    <AppShell sidebar={null} header={null} pageKey={pageKey}>
      <div data-testid="page">{pageKey}</div>
    </AppShell>
  );
  const { rerender } = render(shell('/'));
  const panel = screen.getByTestId('page').parentElement as HTMLDivElement;
  [
    '/forms/shoutouts',
    '/forms/dev-portfolio-submissions/first',
    '/forms/dev-portfolio-submissions/second',
    '/'
  ].forEach((path) => {
    panel.scrollTop = 620;
    panel.scrollLeft = 80;
    rerender(shell(path));
    expect(screen.getByTestId('page').parentElement).toBe(panel);
    expect(panel.scrollTop).toBe(0);
    expect(panel.scrollLeft).toBe(0);
  });
});

test('preserves the current position when page content updates without navigation', () => {
  const { rerender } = render(
    <AppShell sidebar={null} header={null} pageKey="/forms/shoutouts">
      <div data-testid="page">Loading</div>
    </AppShell>
  );
  const panel = screen.getByTestId('page').parentElement as HTMLDivElement;
  panel.scrollTop = 400;
  rerender(
    <AppShell sidebar={null} header={null} pageKey="/forms/shoutouts">
      <div data-testid="page">Loaded</div>
    </AppShell>
  );
  expect(panel.scrollTop).toBe(400);
});
