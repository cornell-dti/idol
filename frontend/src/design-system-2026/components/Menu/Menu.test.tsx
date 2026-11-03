import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { DesignSystemScope } from '../Theme/Theme';
import { Menu, MenuGroup, MenuItem, MenuSeparator } from './Menu';

// Jest 27's JSDOM predates PointerEvent; Base UI synthesizes one for keyboard activation.
beforeAll(() => {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
});
afterAll(() => {
  Reflect.deleteProperty(window, 'PointerEvent');
});

test('menu supports keyboard actions, disabled items, and portal themes', async () => {
  const duplicate = jest.fn();
  const unavailable = jest.fn();
  render(
    <DesignSystemScope theme="dark">
      <Menu trigger={<Button>Actions</Button>}>
        <MenuGroup label="Page actions">
          <MenuItem onClick={duplicate}>Duplicate</MenuItem>
          <MenuItem disabled onClick={unavailable}>
            Unavailable
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="danger">Delete</MenuItem>
      </Menu>
    </DesignSystemScope>
  );
  const trigger = screen.getByRole('button', { name: 'Actions' });
  trigger.focus();
  userEvent.keyboard('{ArrowDown}');
  const menu = await screen.findByRole('menu');
  expect(menu.closest('[data-idol-theme]')).toHaveAttribute('data-idol-theme', 'dark');
  const item = screen.getByRole('menuitem', { name: 'Duplicate' });
  await waitFor(() => expect(item).toHaveFocus());
  fireEvent.click(screen.getByRole('menuitem', { name: 'Unavailable' }));
  expect(unavailable).not.toHaveBeenCalled();
  userEvent.keyboard('{End}');
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus());
  userEvent.keyboard('{Home}{Enter}');
  await waitFor(() => expect(duplicate).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  await waitFor(() => expect(trigger).toHaveFocus());
});

test('Escape dismisses the menu and restores focus without running an action', async () => {
  const action = jest.fn();
  render(
    <Menu trigger={<Button>More actions</Button>}>
      <MenuItem onClick={action}>Archive</MenuItem>
    </Menu>
  );
  const trigger = screen.getByRole('button', { name: 'More actions' });
  userEvent.click(trigger);
  await screen.findByRole('menu');
  userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  await waitFor(() => expect(trigger).toHaveFocus());
  expect(action).not.toHaveBeenCalled();
});
