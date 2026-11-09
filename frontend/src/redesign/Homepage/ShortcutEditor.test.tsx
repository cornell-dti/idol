import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShortcutEditor from './ShortcutEditor';
import { defaultShortcuts } from './shortcuts';

beforeAll(() => {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    configurable: true,
    value: jest.fn()
  });
});
afterAll(() => {
  Reflect.deleteProperty(window, 'PointerEvent');
  Reflect.deleteProperty(HTMLElement.prototype, 'setPointerCapture');
});

const rect = (top: number, height: number): DOMRect => ({
  left: 100,
  right: 600,
  top,
  bottom: top + height,
  width: 500,
  height,
  x: 100,
  y: top,
  toJSON: () => ({})
});

it('shows a grabbed row and insertion boundary, then saves the item at that boundary', () => {
  const onSave = jest.fn();
  render(<ShortcutEditor selected={defaultShortcuts} onSave={onSave} onClose={() => {}} />);
  const list = within(screen.getByRole('region', { name: 'Added:' })).getByRole('list');
  jest.spyOn(list, 'getBoundingClientRect').mockReturnValue(rect(100, 160));
  Array.from(list.children).forEach((row, index) =>
    jest.spyOn(row, 'getBoundingClientRect').mockReturnValue(rect(100 + index * 40, 40))
  );
  const handle = screen.getByRole('button', { name: 'Reorder Shoutouts' });
  fireEvent.pointerDown(handle, { button: 0, clientX: 112, clientY: 120 });
  expect(document.querySelector('.dragPreview')).toHaveTextContent('Shoutouts');
  fireEvent.pointerMove(handle, { clientX: 112, clientY: 235 });
  expect(list.children[3]).toHaveClass('dropBefore');
  fireEvent.pointerUp(handle);
  expect(document.querySelector('.dragPreview')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenCalledWith(['tec', 'profile', 'shoutouts', 'coffee']);
});

it('cancels a grab with Escape and leaves the saved order untouched', () => {
  const onSave = jest.fn();
  const onClose = jest.fn();
  render(<ShortcutEditor selected={defaultShortcuts} onSave={onSave} onClose={onClose} />);
  const handle = screen.getByRole('button', { name: 'Reorder Shoutouts' });
  fireEvent.pointerDown(handle, { button: 0, clientX: 112, clientY: 120 });
  fireEvent.keyDown(handle, { key: 'Escape' });
  expect(document.querySelector('.dragPreview')).not.toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenCalledWith(defaultShortcuts);
});
