import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider } from '../../../design-system-2026/components';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ShoutoutForm from './ShoutoutForm';

jest.mock('../../../API/ShoutoutsAPI', () => ({
  __esModule: true,
  default: { giveShoutout: jest.fn() }
}));
jest.mock('../../../API/ImagesAPI', () => ({
  __esModule: true,
  default: { uploadImage: jest.fn() }
}));
const user = { email: 'test@cornell.edu', firstName: 'Test', lastName: 'Member' } as IdolMember;
const giveShoutout = ShoutoutsAPI.giveShoutout as jest.Mock;
function fillAndSend() {
  fireEvent.change(screen.getByLabelText('Who is awesome?'), { target: { value: 'Alex' } });
  fireEvent.change(screen.getByLabelText('Why are they awesome?'), {
    target: { value: 'Thanks for your help!' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send shoutout' }));
}
test('shows a toast only after a successful send and keeps errors inline with the draft intact', async () => {
  giveShoutout.mockResolvedValueOnce({ error: 'Try later.' }).mockResolvedValueOnce({});
  const onSent = jest.fn();
  render(
    <ToastProvider>
      <ShoutoutForm user={user} members={[]} onSent={onSent} />
    </ToastProvider>
  );
  fillAndSend();
  expect(await screen.findByRole('alert')).toHaveTextContent('Try later.');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Who is awesome?')).toHaveValue('Alex');
  expect(onSent).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Send shoutout' }));
  expect(await screen.findByRole('dialog', { name: 'Shoutout sent to Alex.' })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByLabelText('Who is awesome?')).toHaveValue(''));
  expect(onSent).toHaveBeenCalledTimes(1);
  expect(screen.queryByText(/Thank you for recognizing/)).not.toBeInTheDocument();
});
