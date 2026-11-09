import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomepageView from './HomepageView';
import { ToastProvider } from '../../design-system-2026/components';
import { makeCustomCover } from './covers';

jest.mock('next/router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('./covers', () => ({
  ...jest.requireActual('./covers'),
  makeCustomCover: jest.fn()
}));

const page = () =>
  render(
    <ToastProvider>
      <HomepageView
        name="Test Member"
        storageKey="test-home"
        summary={{ coffee: {}, tec: {}, shoutouts: {} }}
        onRetry={() => {}}
      />
    </ToastProvider>
  );

const openEditor = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Change cover' }));
  return screen.getByRole('dialog', { name: 'Edit cover' });
};

beforeEach(() => localStorage.clear());

it('saves a dropped photo across remounts and falls back to the original when it is removed', async () => {
  const file = new File(['image'], 'Workshop.png', { type: 'image/png' });
  const src = 'data:image/webp;base64,AAAA';
  (makeCustomCover as jest.Mock).mockResolvedValueOnce({
    id: 'custom-workshop',
    name: 'Workshop',
    src
  });
  const { container, unmount } = page();
  const dialog = openEditor();
  fireEvent.drop(dialog, { dataTransfer: { files: [file], types: ['Files'] } });
  expect(await screen.findByRole('radio', { name: 'Workshop' })).toBeChecked();
  expect(makeCustomCover).toHaveBeenCalledWith(file);
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(container.querySelector('.heroPhoto')).toHaveAttribute('src', src);
  unmount();

  const reopened = page();
  expect(reopened.container.querySelector('.heroPhoto')).toHaveAttribute('src', src);
  openEditor();
  expect(screen.getByRole('radio', { name: 'Workshop' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Workshop' }));
  expect(screen.getByRole('radio', { name: 'IDOL work sesh' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await waitFor(() =>
    expect(screen.queryByRole('dialog', { name: 'Edit cover' })).not.toBeInTheDocument()
  );

  openEditor();
  expect(screen.getByRole('radio', { name: 'Workshop' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Workshop' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(reopened.container.querySelector('.heroPhoto')).toHaveAttribute(
    'src',
    '/redesign/home/covers/idol-work-session.webp'
  );
  expect(JSON.parse(localStorage.getItem('test-home:cover') ?? '{}').custom).toEqual([]);
});
