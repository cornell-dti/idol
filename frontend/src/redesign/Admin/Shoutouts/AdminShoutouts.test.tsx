import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ToastProvider } from '../../../design-system-2026/components';
import { AdminShoutoutsView } from './AdminShoutouts';

// jsdom lacks these; the list's arrow keys scroll with the first two.
beforeAll(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
  Element.prototype.scrollTo = jest.fn();
  // Base UI's switch dispatches a PointerEvent when clicked; jsdom lacks the constructor.
  if (!window.PointerEvent)
    window.PointerEvent = MouseEvent as unknown as typeof window.PointerEvent;
});

const giver: IdolMember = {
  netid: 'test',
  email: 'test@cornell.edu',
  firstName: 'Test',
  lastName: 'Member',
  pronouns: '',
  semesterJoined: '',
  graduation: '',
  major: '',
  hometown: '',
  about: '',
  subteams: [],
  role: 'developer',
  roleDescription: 'Developer'
};

test('switches presentation layouts without exposing hidden shoutouts or losing the stack position', () => {
  const timestamp = Date.now();
  const shoutouts = ['First', 'Second', 'Third', 'Hidden'].map((receiver, index) => ({
    giver,
    receiver,
    message: `Thanks, ${receiver}!`,
    timestamp,
    isAnon: false,
    hidden: receiver === 'Hidden',
    uuid: String(index)
  }));

  render(
    <ToastProvider>
      <AdminShoutoutsView shoutouts={shoutouts} retry={jest.fn()} onVisibilityChange={jest.fn()} />
    </ToastProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Present' }));
  const dialog = within(screen.getByRole('dialog', { name: 'Present shoutouts' }));
  expect(dialog.getByRole('tab', { name: 'List' })).toHaveAttribute('aria-selected', 'true');
  expect(dialog.getByRole('list', { name: 'Presented shoutouts' })).toBeVisible();
  const progress = dialog.getByRole('progressbar', { name: 'Presentation progress' });
  expect(progress).toHaveAttribute('aria-valuetext', '1 of 3');

  fireEvent.click(dialog.getByRole('tab', { name: 'Stack' }));
  fireEvent.click(dialog.getByRole('button', { name: 'Next shoutout' }));
  expect(dialog.getByRole('heading', { name: 'Second' })).toBeVisible();
  expect(progress).toHaveAttribute('aria-valuetext', '2 of 3');

  fireEvent.click(dialog.getByRole('tab', { name: 'List' }));
  const list = dialog.getByRole('list', { name: 'Presented shoutouts' });
  expect(
    within(list)
      .getAllByRole('heading')
      .map((heading) => heading.textContent)
  ).toEqual(['First', 'Second', 'Third']);
  expect(dialog.queryByRole('button', { name: 'Next shoutout' })).not.toBeInTheDocument();
  // The list steps card by card on every arrow key, leaving the stack where it was.
  expect(fireEvent.keyDown(list, { key: 'ArrowDown' })).toBe(false);
  expect(fireEvent.keyDown(list, { key: 'ArrowRight' })).toBe(false);

  fireEvent.click(dialog.getByRole('tab', { name: 'Stack' }));
  expect(dialog.getByRole('heading', { name: 'Second' })).toBeVisible();
});

test('auto scroll stays on when its first frame is timestamped before the click', () => {
  // Browsers stamp a frame with when it began, which can be just before the click that started
  // the loop. That first step used to run backwards to the top, count as "reached the end" and
  // flip the switch straight back off. Queue frames by hand to replay that.
  const frames: FrameRequestCallback[] = [];
  const raf = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback) => frames.push(callback));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  // jsdom has no layout; give the stage room to scroll.
  const scrollHeight = jest
    .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
    .mockReturnValue(5000);
  const clientHeight = jest
    .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
    .mockReturnValue(500);
  const runFrames = (at: number) => {
    const queued = frames.splice(0);
    act(() => queued.forEach((callback) => callback(at)));
  };
  try {
    const shoutouts = ['First', 'Second', 'Third'].map((receiver, index) => ({
      giver,
      receiver,
      message: `Thanks, ${receiver}!`,
      timestamp: Date.now(),
      isAnon: false,
      hidden: false,
      uuid: String(index)
    }));
    render(
      <ToastProvider>
        <AdminShoutoutsView
          shoutouts={shoutouts}
          retry={jest.fn()}
          onVisibilityChange={jest.fn()}
        />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Present' }));
    const dialog = within(screen.getByRole('dialog', { name: 'Present shoutouts' }));
    const toggle = dialog.getByRole('switch', { name: 'Auto scroll' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    runFrames(performance.now() - 8);
    runFrames(performance.now() + 16);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  } finally {
    raf.mockRestore();
    scrollHeight.mockRestore();
    clientHeight.mockRestore();
    jest.restoreAllMocks();
  }
});
