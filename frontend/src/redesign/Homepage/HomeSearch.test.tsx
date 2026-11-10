import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomepageView from './HomepageView';
import HomeSearch from './HomeSearch';
import { ToastProvider } from '../../design-system-2026/components';
import { rememberPage } from './recentPages';

const mockPush = jest.fn();
let mockCanAdmin = false;
jest.mock('next/router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../components/Common/FirestoreDataProvider', () => ({
  useHasAdminPermission: () => mockCanAdmin
}));
jest.mock('../../components/Common/UserProvider/UserProvider', () => ({
  useUserEmail: () => 'search-test@cornell.edu'
}));
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
beforeEach(() => {
  mockPush.mockClear();
  mockCanAdmin = false;
  localStorage.clear();
});

it('finds Settings by prefix, typo, or intent and bolds the typed prefix', async () => {
  const input = setup();
  fireEvent.change(input, { target: { value: 'sett' } });
  const settings = await screen.findByRole('option', { name: 'Settings' });
  expect(settings.querySelector('strong')).toHaveTextContent('Sett');
  for (const query of ['setings', 'how do I change my accent color']) {
    fireEvent.change(input, { target: { value: query } });
    expect(await screen.findByRole('option', { name: 'Settings' })).toBeVisible();
  }
  fireEvent.click(screen.getByRole('option', { name: 'Settings' }));
  expect(mockPush).toHaveBeenCalledWith('/settings');
});

it('opens pasted detail links and omits admin links for members', async () => {
  const input = setup();
  fireEvent.change(input, { target: { value: '/admin/recruitment-timeline' } });
  expect(await screen.findByText('No matching actions. Try a different search.')).toBeVisible();
  fireEvent.change(input, {
    target: { value: 'https://idol.cornelldti.org/interview-scheduler/test-id' }
  });
  fireEvent.click(await screen.findByRole('option', { name: 'Schedule' }));
  expect(mockPush).toHaveBeenCalledWith('/interview-scheduler/test-id');
});

it('includes admin pages for users with admin permissions', async () => {
  mockCanAdmin = true;
  const input = setup();
  fireEvent.change(input, { target: { value: 'recruiting deadlines' } });
  fireEvent.click(await screen.findByRole('option', { name: /Admin.*Recruitment Timeline/ }));
  expect(mockPush).toHaveBeenCalledWith('/admin/recruitment-timeline');
});

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

it('focuses the Home search and opens suggestions with Command-K', async () => {
  const input = setup();
  fireEvent.keyDown(window, { key: 'k', metaKey: true });
  expect(input).toHaveFocus();
  expect(await screen.findByRole('listbox', { name: 'Common actions' })).toBeVisible();
});

it('opens the sidebar panel with recents, then shows matching pages as you type', async () => {
  rememberPage('search-test@cornell.edu', { href: '/help', label: 'Help' });
  render(<HomeSearch placement="sidebar" compact />);
  const input = screen.getByRole('combobox', { name: 'Search pages and actions' });
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
  const recent = await screen.findByRole('listbox', { name: 'Recent pages' });
  expect(input).toHaveFocus();
  expect(screen.getByRole('combobox', { name: 'Search pages and actions' })).toBe(input);
  expect(within(recent).getByRole('option', { name: 'Help' })).toBeVisible();
  fireEvent.change(input, { target: { value: 'sett' } });
  expect(await screen.findByRole('option', { name: 'Settings' })).toBeVisible();
  fireEvent.keyDown(input, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  expect(input).toBeVisible();
});

it('suggests Coffee and TEC matches without changing the homepage shortcuts', async () => {
  const input = setup();
  const shortcutRegion = screen.getByRole('region', { name: 'Shortcuts' });
  const before = within(shortcutRegion)
    .getAllByRole('link', { hidden: true })
    .map((link) => link.textContent);
  fireEvent.change(input, { target: { value: 'Coffee' } });
  const coffee = await screen.findByRole('option', { name: /Coffee Chats/ });
  expect(coffee.querySelector('strong')).toHaveTextContent('Coffee');
  expect(coffee).toHaveTextContent(/^Coffee Chats$/);
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

it('opens the latest distinct pages on focus and restores them after clearing the query', async () => {
  const email = 'search-test@cornell.edu';
  rememberPage(email, { href: '/alumni', label: 'Alumni' });
  rememberPage(email, { href: '/forms', label: 'Forms' });
  rememberPage(email, { href: '/settings', label: 'Settings' });
  rememberPage(email, { href: '/alumni', label: 'Alumni' });
  rememberPage(email, { href: '/help', label: 'Help' });
  rememberPage('someone-else@cornell.edu', { href: '/admin', label: 'Admin' });

  const input = setup();
  act(() => input.focus());
  const recent = await screen.findByRole('listbox', { name: 'Recent pages' });
  const options = within(recent).getAllByRole('option');
  expect(options).toHaveLength(3);
  expect(options[0]).toHaveAccessibleName('Help');
  expect(options[1]).toHaveAccessibleName(/^Alumni/);
  expect(options[2]).toHaveAccessibleName('Settings');

  fireEvent.change(input, { target: { value: 'coffee' } });
  expect(await screen.findByRole('listbox', { name: 'Matching actions' })).toBeVisible();
  fireEvent.change(input, { target: { value: '' } });
  const restored = await screen.findByRole('listbox', { name: 'Recent pages' });
  fireEvent.click(within(restored).getByRole('option', { name: 'Help' }));
  expect(mockPush).toHaveBeenCalledWith('/help');
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
