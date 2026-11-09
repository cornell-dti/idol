import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from './Navigation';
import { ToastProvider } from '../../design-system-2026/components';
import NavigationEditor from './NavigationEditor';
import memberNavigation from '../navigation';
import { defaultNavigation, parseNavigation } from './preferences';

const items = memberNavigation('/');
const available = items.filter((item) => item.id !== '/');
const allowed = available.map((item) => item.id);
beforeEach(() => localStorage.clear());
const originalMatchMedia = window.matchMedia;
beforeAll(() => {
  window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  });
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    configurable: true,
    value: jest.fn()
  });
});
afterAll(() => {
  window.matchMedia = originalMatchMedia;
  Reflect.deleteProperty(window, 'PointerEvent');
  Reflect.deleteProperty(HTMLElement.prototype, 'setPointerCapture');
});

test('normalizes saved preferences, excludes unavailable routes and fixes Home/More positions', () => {
  expect(parseNavigation(null, allowed)).toEqual(defaultNavigation);
  expect(parseNavigation('invalid', allowed)).toEqual(defaultNavigation);
  expect(
    parseNavigation(
      JSON.stringify([
        '/admin',
        '/',
        '/alumni',
        '/alumni',
        '/forms/coffeeChats',
        '/forms',
        '/forms/shoutouts'
      ]),
      allowed
    )
  ).toEqual(['/alumni', '/forms/coffeeChats', '/forms']);
  expect(parseNavigation('[]', allowed)).toEqual(defaultNavigation);
});

test('edits to five items, saves across remounts and keeps only unpinned routes in More', async () => {
  const props = { items, storageKey: 'navbar:test', pageKey: '/' };
  const { unmount } = render(
    <ToastProvider>
      <Navigation {...props} />
    </ToastProvider>
  );
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(
    within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)
  ).toEqual(['Home', 'Shoutouts', 'TEC']);
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  const more = await screen.findByRole('navigation', { name: 'More pages' });
  expect(within(more).getByRole('link', { name: 'Coffee Chats' })).toBeInTheDocument();
  expect(within(more).queryByRole('link', { name: 'Shoutouts' })).not.toBeInTheDocument();
  expect(within(more).queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Edit navbar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add Coffee Chats' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add Alumni' }));
  expect(screen.queryByRole('button', { name: 'Reorder Alumni' })).not.toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Coffee Chats' }), {
    key: 'ArrowLeft'
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(localStorage.getItem('navbar:test')).toBe(
    JSON.stringify(['/forms/shoutouts', '/forms/coffeeChats', '/forms/teamEventCredits'])
  );
  await waitFor(() =>
    expect(screen.queryByRole('dialog', { name: 'Explore IDOL' })).not.toBeInTheDocument()
  );
  expect(await screen.findByRole('dialog', { name: 'Navbar saved.' })).toBeInTheDocument();
  unmount();
  render(
    <ToastProvider>
      <Navigation {...props} />
    </ToastProvider>
  );
  expect(
    within(screen.getByRole('navigation', { name: 'Main navigation' }))
      .getAllByRole('link')
      .map((link) => link.textContent)
  ).toEqual(['Home', 'Shoutouts', 'Coffee Chats', 'TEC']);
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  const restoredMore = await screen.findByRole('navigation', { name: 'More pages' });
  expect(
    within(restoredMore).queryByRole('link', { name: 'Coffee Chats' })
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Edit navbar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Remove Shoutouts' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(localStorage.getItem('navbar:test')).toBe(
    JSON.stringify(['/forms/shoutouts', '/forms/coffeeChats', '/forms/teamEventCredits'])
  );
});

const rect = (left: number, top: number, width: number, height: number): DOMRect => ({
  left,
  right: left + width,
  top,
  bottom: top + height,
  width,
  height,
  x: left,
  y: top,
  toJSON: () => ({})
});
test('drags pages from the grid into a live navbar, reorders them, and drags them back out', () => {
  const onSave = jest.fn();
  render(
    <NavigationEditor
      items={available}
      selected={defaultNavigation}
      onSave={onSave}
      onCancel={() => {}}
    />
  );
  const preview = screen.getByRole('group', { name: 'Navbar preview' });
  const grid = screen.getByRole('group', { name: 'Available pages' });
  jest.spyOn(preview, 'getBoundingClientRect').mockReturnValue(rect(0, 500, 400, 70));
  jest.spyOn(grid, 'getBoundingClientRect').mockReturnValue(rect(0, 100, 400, 350));
  const measurePinned = () =>
    Array.from(preview.querySelectorAll('[data-pinned-item]')).forEach((item, index) =>
      jest.spyOn(item, 'getBoundingClientRect').mockReturnValue(rect(80 + index * 80, 500, 80, 70))
    );
  measurePinned();
  const coffee = screen.getByRole('button', { name: 'Add Coffee Chats' });
  fireEvent.pointerDown(coffee, { button: 0, clientX: 50, clientY: 130 });
  expect(document.querySelector('.dragPreview')).toHaveTextContent('Coffee Chats');
  fireEvent.pointerMove(coffee, { clientX: 190, clientY: 535 });
  expect(preview.querySelectorAll('[data-pinned-item]')[1]).toHaveClass('insertBefore');
  fireEvent.pointerUp(coffee);
  expect(document.querySelector('.dragPreview')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenLastCalledWith([
    '/forms/shoutouts',
    '/forms/coffeeChats',
    '/forms/teamEventCredits'
  ]);
  measurePinned();
  const shoutouts = screen.getByRole('button', { name: 'Reorder Shoutouts' });
  fireEvent.pointerDown(shoutouts, { button: 0, clientX: 120, clientY: 535 });
  fireEvent.pointerMove(shoutouts, { clientX: 320, clientY: 535 });
  fireEvent.pointerUp(shoutouts);
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenLastCalledWith([
    '/forms/coffeeChats',
    '/forms/teamEventCredits',
    '/forms/shoutouts'
  ]);
  const pinnedCoffee = screen.getByRole('button', { name: 'Reorder Coffee Chats' });
  fireEvent.pointerDown(pinnedCoffee, { button: 0, clientX: 120, clientY: 535 });
  fireEvent.pointerMove(pinnedCoffee, { clientX: 80, clientY: 150 });
  expect(grid).toHaveClass('removeTarget');
  fireEvent.pointerUp(pinnedCoffee);
  expect(screen.getByRole('button', { name: 'Add Coffee Chats' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Shoutouts' }));
  expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
});
