import React from 'react';
import Router from 'next/router';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';
import RedesignedUserProfile from '../../../redesign/Forms/UserProfile/UserProfile';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import { Emitters } from '../../../utils';

jest.mock('../../Common/FirestoreDataProvider', () => ({ useSelf: jest.fn() }));
jest.mock('../../Common/UserProvider/UserProvider', () => ({ useUserEmail: jest.fn() }));
jest.mock('../../../API/MembersAPI', () => ({ MembersAPI: { updateMember: jest.fn() } }));
jest.mock('../../../../../new-dti-website/public/github.svg', () => ({ src: 'github.svg' }));

const member: Member = {
  netid: 'test123',
  email: 'test123@cornell.edu',
  firstName: 'Test',
  lastName: 'Member',
  pronouns: 'they/them',
  semesterJoined: 'Fall 2026',
  graduation: 'May 2028',
  college: 'eng',
  major: 'Computer Science',
  hometown: 'Ithaca',
  about: 'Hello!',
  subteams: ['idol'],
  role: 'developer',
  roleDescription: 'Developer',
  website: null
};

const updateMember = MembersAPI.updateMember as jest.MockedFunction<typeof MembersAPI.updateMember>;

describe.each([
  ['legacy', UserProfile],
  ['redesigned', RedesignedUserProfile]
] as const)('%s profile saving', (_, Profile) => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelf as jest.Mock).mockReturnValue(member);
    (useUserEmail as jest.Mock).mockReturnValue(member.email);
    updateMember.mockResolvedValue({ member });
  });

  test('only enables Save for changed fields, including after reverting edits', () => {
    render(<Profile />);
    const save = screen.getByRole('button', { name: /^save/i });
    const hometown = screen.getByDisplayValue('Ithaca');
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(updateMember).not.toHaveBeenCalled();

    fireEvent.change(hometown, { target: { value: 'Boston' } });
    expect(save).toBeEnabled();
    fireEvent.change(hometown, { target: { value: 'Ithaca' } });
    expect(save).toBeDisabled();
  });

  test('treats cleared optional fields like their original null values', () => {
    render(<Profile />);
    // The legacy form's label is not associated with its input.
    const website =
      screen.queryByRole('textbox', { name: 'Website' }) ??
      screen.getByText('Website').parentElement!.querySelector('input')!;
    const save = screen.getByRole('button', { name: /^save/i });
    fireEvent.change(website, { target: { value: 'example.com' } });
    expect(save).toBeEnabled();
    fireEvent.change(website, { target: { value: '   ' } });
    expect(save).toBeDisabled();
  });

  test('disables Save during a request and resets the baseline after success', async () => {
    let finish!: (response: { member: Member }) => void;
    updateMember.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    render(<Profile />);
    const hometown = screen.getByDisplayValue('Ithaca');
    const save = screen.getByRole('button', { name: /^save/i });
    fireEvent.change(hometown, { target: { value: 'Boston' } });
    fireEvent.click(save);
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(updateMember).toHaveBeenCalledTimes(1);
    await act(async () => {
      finish({ member: { ...member, hometown: 'Boston' } });
    });
    expect(save).toBeDisabled();
    fireEvent.change(hometown, { target: { value: 'Ithaca' } });
    expect(save).toBeEnabled();
    fireEvent.change(hometown, { target: { value: 'Boston' } });
    expect(save).toBeDisabled();
  });

  test('keeps edits made while saving dirty after the request succeeds', async () => {
    let finish!: (response: { member: Member }) => void;
    updateMember.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    render(<Profile />);
    const hometown = screen.getByDisplayValue('Ithaca');
    const save = screen.getByRole('button', { name: /^save/i });
    fireEvent.change(hometown, { target: { value: 'Boston' } });
    fireEvent.click(save);
    fireEvent.change(hometown, { target: { value: 'Seattle' } });
    await act(async () => {
      finish({ member: { ...member, hometown: 'Boston' } });
    });
    expect(hometown).toHaveValue('Seattle');
    expect(save).toBeEnabled();
    fireEvent.click(save);
    await waitFor(() => expect(save).toBeDisabled());
    expect(updateMember).toHaveBeenLastCalledWith(expect.objectContaining({ hometown: 'Seattle' }));
  });

  test.each(['api', 'network'])(
    'preserves edits and allows retry after a %s error',
    async (error) => {
      if (error === 'api') updateMember.mockResolvedValueOnce({ member, error: 'Save failed' });
      else updateMember.mockRejectedValueOnce(new Error('Offline'));
      render(<Profile />);
      const hometown = screen.getByDisplayValue('Ithaca');
      const save = screen.getByRole('button', { name: /^save/i });
      fireEvent.change(hometown, { target: { value: 'Boston' } });
      fireEvent.click(save);
      await waitFor(() => expect(save).toBeEnabled());
      expect(hometown).toHaveValue('Boston');
      fireEvent.click(save);
      await waitFor(() => expect(save).toBeDisabled());
      expect(updateMember).toHaveBeenCalledTimes(2);
    }
  );

  test('still validates required fields before saving', () => {
    const emitError = jest.spyOn(Emitters.generalError, 'emit');
    render(<Profile />);
    fireEvent.change(screen.getByDisplayValue('Ithaca'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /^save/i }));
    expect(updateMember).not.toHaveBeenCalled();
    expect(emitError).toHaveBeenCalledWith(
      expect.objectContaining({ headerMsg: 'Complete Required Fields' })
    );
    emitError.mockRestore();
  });
});

test('redesigned profile keeps unsaved edits until leaving is confirmed', async () => {
  (useSelf as jest.Mock).mockReturnValue(member);
  (useUserEmail as jest.Mock).mockReturnValue(member.email);
  const push = jest.fn().mockResolvedValue(true);
  const router = { push, replace: jest.fn(), beforePopState: jest.fn(), events: Router.events };
  const originalRouter = Router.router;
  Object.assign(Router, { router });
  const view = render(<RedesignedUserProfile />);

  try {
    await router.push('/settings');
    expect(push).toHaveBeenCalledTimes(1);
    push.mockClear();

    const hometown = screen.getByDisplayValue('Ithaca');
    fireEvent.change(hometown, { target: { value: 'Boston' } });
    await act(async () => {
      expect(await router.push('/settings')).toBe(false);
    });
    expect(screen.getByRole('dialog', { name: 'Unsaved changes' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Stay on page' }));
    expect(push).not.toHaveBeenCalled();
    expect(hometown).toHaveValue('Boston');

    await act(async () => {
      await router.push('/settings');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Leave page' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/settings'));

    fireEvent.change(hometown, { target: { value: 'Ithaca' } });
    expect(router.push).toBe(push);
  } finally {
    view.unmount();
    Object.assign(Router, { router: originalRouter });
  }
});
