import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ToastProvider } from '../../../design-system-2026/components';
import { AdminShoutoutsView } from './AdminShoutouts';

// jsdom has neither; the list's arrow keys scroll with them.
beforeAll(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
  Element.prototype.scrollTo = jest.fn();
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
