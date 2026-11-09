import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider } from '../../../design-system-2026/components';
import { AdminShoutoutsView } from './AdminShoutouts';

jest.mock('./useAdminShoutouts', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../API/ShoutoutsAPI', () => ({ __esModule: true, default: {} }));
jest.mock('../../../API/ImagesAPI', () => ({ __esModule: true, default: {} }));

const item = (receiver: string, timestamp: string, hidden = false): Shoutout => ({
  uuid: receiver,
  receiver,
  timestamp: Date.parse(timestamp),
  hidden,
  message: 'Thanks for helping!',
  isAnon: true,
  giver: { firstName: 'Private', lastName: 'Sender' } as IdolMember
});

const items = [
  item('Before range', '2026-09-16T03:59:59Z'),
  item('Newbies', '2026-09-16T04:00:00Z'),
  item('Hidden recipient', '2026-09-17T16:00:00Z', true),
  item('Claire', '2026-09-30T03:59:59Z'),
  item('After range', '2026-09-30T04:00:00Z')
];

function setup(onVisibilityChange = jest.fn().mockResolvedValue(undefined)) {
  render(
    <ToastProvider>
      <AdminShoutoutsView
        shoutouts={items}
        retry={jest.fn()}
        onVisibilityChange={onVisibilityChange}
      />
    </ToastProvider>
  );
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-09-16' } });
  fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2026-09-29' } });
  return onVisibilityChange;
}

it('presents only visible shoutouts in the selected Eastern dates and exits with Escape', async () => {
  setup();
  expect(
    within(screen.getByRole('list', { name: 'Shoutouts' })).getAllByRole('listitem')
  ).toHaveLength(3);
  expect(screen.queryByText('Before range')).not.toBeInTheDocument();
  expect(screen.queryByText('After range')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Present' }));
  const dialog = within(await screen.findByRole('dialog', { name: 'Present shoutouts' }));
  expect(dialog.getByText('1 out of 2')).toBeInTheDocument();
  expect(dialog.getByRole('button', { name: 'Previous shoutout' })).toBeDisabled();
  expect(dialog.queryByText(/Private Sender|Hidden recipient/)).not.toBeInTheDocument();
  expect(dialog.queryByRole('button', { name: /hide shoutout/i })).not.toBeInTheDocument();
  const back = dialog.getByRole('button', { name: 'Back' });
  fireEvent.keyDown(back, { key: 'ArrowDown' });
  expect(dialog.getByRole('heading', { name: 'Claire' })).toBeInTheDocument();
  expect(dialog.getByRole('button', { name: 'Next shoutout' })).toBeDisabled();
  fireEvent.click(dialog.getByRole('button', { name: 'Previous shoutout' }));
  expect(dialog.getByRole('heading', { name: 'Newbies' })).toBeInTheDocument();
  fireEvent.keyDown(back, { key: 'Escape' });
  await waitFor(() =>
    expect(screen.queryByRole('dialog', { name: 'Present shoutouts' })).not.toBeInTheDocument()
  );
  expect(screen.getByRole('button', { name: 'Present' })).toBeInTheDocument();
});

it('requires confirmation and keeps the dialog open when moderation fails', async () => {
  const change = setup(jest.fn().mockRejectedValue(new Error('Permission denied')));
  fireEvent.click(screen.getByRole('tab', { name: 'Hidden' }));
  fireEvent.click(screen.getByRole('button', { name: 'Unhide shoutout for Hidden recipient' }));
  expect(change).not.toHaveBeenCalled();
  const dialog = screen.getByRole('dialog', { name: 'Unhide shoutout?' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Unhide shoutout' }));
  await waitFor(() =>
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Couldn’t update')
  );
  expect(change).toHaveBeenCalledWith('Hidden recipient', false);
  expect(screen.getByRole('dialog', { name: 'Unhide shoutout?' })).toBeInTheDocument();
});
