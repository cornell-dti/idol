import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider } from '../design-system-2026/components';
import { EventEmitter } from '../utils';
import SuccessNotifications from './SuccessNotifications';

test('bridges existing success events once and retains follow-up links in the toast', async () => {
  const emitter = new EventEmitter<{
    headerMsg: string;
    contentMsg: string;
    child?: JSX.Element;
  }>();
  const subscribe = jest.spyOn(emitter, 'subscribe');
  const unsubscribe = jest.spyOn(emitter, 'unsubscribe');
  const view = (
    <ToastProvider>
      <SuccessNotifications onEmitter={emitter} />
    </ToastProvider>
  );
  const { rerender, unmount } = render(view);
  act(() => emitter.emit({ headerMsg: 'Information updated', contentMsg: 'Profile saved.' }));
  expect(await screen.findByRole('dialog', { name: 'Profile saved.' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  rerender(view);
  act(() =>
    emitter.emit({
      headerMsg: 'Deployment started',
      contentMsg: 'Updates are being published.',
      child: <a href="/admin">View progress</a>
    })
  );
  expect(await screen.findByRole('link', { name: 'View progress' })).toHaveAttribute(
    'href',
    '/admin'
  );
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  unmount();
  expect(unsubscribe).toHaveBeenCalledTimes(subscribe.mock.calls.length);
});
