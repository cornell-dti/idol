import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ToastProvider } from '../../../design-system-2026/components';
import { AdminShoutoutsView } from './AdminShoutouts';

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
  fireEvent.click(dialog.getByRole('button', { name: 'Next shoutout' }));
  expect(dialog.getByRole('heading', { name: 'Second' })).toBeVisible();

  fireEvent.click(dialog.getByRole('tab', { name: 'List' }));
  const list = dialog.getByRole('list', { name: 'Presented shoutouts' });
  expect(
    within(list)
      .getAllByRole('heading')
      .map((heading) => heading.textContent)
  ).toEqual(['First', 'Second', 'Third']);
  expect(dialog.queryByRole('button', { name: 'Next shoutout' })).not.toBeInTheDocument();
  expect(fireEvent.keyDown(list, { key: 'ArrowDown' })).toBe(true);

  fireEvent.click(dialog.getByRole('tab', { name: 'Stack' }));
  expect(dialog.getByRole('heading', { name: 'Second' })).toBeVisible();
});
