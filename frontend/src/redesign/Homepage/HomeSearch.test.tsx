import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomepageView from './HomepageView';
import { ToastProvider } from '../../design-system-2026/components';

const mockPush = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ push: mockPush }) }));
beforeAll(() => {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: jest.fn()
  });
});
afterAll(() => {
  Reflect.deleteProperty(window, 'PointerEvent');
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});
beforeEach(() => mockPush.mockClear());

const setup = () => {
  render(
    <ToastProvider>
      <HomepageView
        name="Test Member"
        summary={{ coffee: {}, tec: {}, shoutouts: {} }}
        onRetry={() => {}}
      />
    </ToastProvider>
  );
  return screen.getByRole('combobox', { name: 'Search or find common actions' });
};

it('suggests Coffee and TEC matches without changing the homepage shortcuts', async () => {
  const input = setup();
  const shortcutRegion = screen.getByRole('region', { name: 'Shortcuts' });
  const before = within(shortcutRegion)
    .getAllByRole('link', { hidden: true })
    .map((link) => link.textContent);
  fireEvent.change(input, { target: { value: 'Coffee' } });
  expect(await screen.findByRole('option', { name: /Coffee Chats/ })).toBeInTheDocument();
  fireEvent.change(input, { target: { value: 'TEC' } });
  expect(await screen.findByRole('option', { name: /Team Event Credits/ })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: /Coffee Chats/ })).not.toBeInTheDocument();
  expect(
    within(shortcutRegion)
      .getAllByRole('link', { hidden: true })
      .map((link) => link.textContent)
  ).toEqual(before);
  fireEvent.click(screen.getByRole('option', { name: /Team Event Credits/ }));
  expect(mockPush).toHaveBeenCalledWith('/forms/teamEventCredits');
});

it('supports aliases, keyboard selection, no results, and Escape dismissal', async () => {
  const input = setup();
  fireEvent.change(input, { target: { value: 'github' } });
  expect(
    await screen.findByRole('option', { name: /Dev Portfolio Assignments/ })
  ).toBeInTheDocument();
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/forms/devPortfolio'));
  fireEvent.change(input, { target: { value: 'zzzz' } });
  expect(await screen.findByText('No matching actions. Try a different search.')).toBeVisible();
  fireEvent.keyDown(input, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  expect(
    within(screen.getByRole('region', { name: 'Shortcuts' })).getAllByRole('link', { hidden: true })
  ).toHaveLength(4);
});
