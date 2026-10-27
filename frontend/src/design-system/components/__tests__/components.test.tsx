import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Checkbox, LabelledCheckbox } from '../Checkbox/Checkbox';
import { RadioGroup, LabelledRadio } from '../Radio/Radio';
import { LabelledSwitch } from '../Switch/Switch';
import { Modal, ModalClose } from '../Modal/Modal';
import { DesignSystemScope } from '../Theme/Theme';
import { Button, IconButton } from '../Button/Button';
import { Input, Select, Textarea } from '../index';
import { Tabs } from '../Tabs/Tabs';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

// JSDOM bundled with Jest 27 predates PointerEvent; Base UI uses it for native checkbox activation.
beforeAll(() => {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
});
afterAll(() => {
  Reflect.deleteProperty(window, 'PointerEvent');
});

test('tabs navigate with the keyboard without activating disabled items and link their panels', async () => {
  function Example() {
    const [value, setValue] = useState('one');
    return (
      <Tabs
        id="example"
        label="Sections"
        value={value}
        onValueChange={setValue}
        items={[
          { value: 'one', label: 'One', content: 'First panel' },
          { value: 'two', label: 'Two', content: 'Second panel', disabled: true },
          { value: 'three', label: 'Three', content: 'Third panel' }
        ]}
      />
    );
  }
  render(<Example />);
  const one = screen.getByRole('tab', { name: 'One' });
  const three = screen.getByRole('tab', { name: 'Three' });
  userEvent.click(one);
  userEvent.keyboard('{ArrowRight}');
  await waitFor(() => expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus());
  expect(one).toHaveAttribute('aria-selected', 'true');
  userEvent.keyboard('{ArrowRight}');
  await waitFor(() => expect(three).toHaveFocus());
  expect(three).toHaveAttribute('aria-selected', 'true');
  expect(one).toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Third panel');
  expect(screen.getByRole('tabpanel').id).toBe(three.getAttribute('aria-controls'));
  userEvent.keyboard('{ArrowRight}');
  await waitFor(() => expect(one).toHaveFocus());
  userEvent.keyboard('{ArrowLeft}');
  await waitFor(() => expect(three).toHaveFocus());
  userEvent.keyboard('{Home}');
  await waitFor(() => expect(one).toHaveFocus());
  userEvent.keyboard('{End}');
  await waitFor(() => expect(three).toHaveFocus());
  fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
  expect(three).toHaveAttribute('aria-selected', 'true');
});

test('buttons default to non-submitting actions and disabled buttons cannot fire', () => {
  const submit = jest.fn((event) => event.preventDefault());
  const click = jest.fn();
  render(
    <form onSubmit={submit}>
      <Button>Action</Button>
      <Button disabled onClick={click}>
        Unavailable
      </Button>
      <IconButton aria-label="Add item" icon={<span>+</span>} />
      <Button type="submit">Submit</Button>
    </form>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Action' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
  fireEvent.click(screen.getByRole('button', { name: 'Unavailable' }));
  expect(submit).not.toHaveBeenCalled();
  expect(click).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect(submit).toHaveBeenCalledTimes(1);
});

test('fields expose labels, linked descriptions, errors, and selectable values', async () => {
  render(
    <>
      <p id="extra">Additional context.</p>
      <Input
        id="email"
        label="Email"
        hint="Use your team email."
        error="Enter an email."
        aria-describedby="extra"
      />
      <Select
        id="team"
        label="Team"
        options={[
          { value: 'idol', label: 'IDOL' },
          { value: 'disabled', label: 'Unavailable', disabled: true }
        ]}
      />
      <Textarea id="notes" label="Notes" />
    </>
  );
  const email = screen.getByRole('textbox', { name: 'Email' });
  expect(email).toHaveAttribute('aria-invalid', 'true');
  expect(email).toHaveAccessibleDescription(
    'Additional context. Use your team email. Enter an email.'
  );
  fireEvent.change(email, { target: { value: 'example@cornell.edu' } });
  expect(email).toHaveValue('example@cornell.edu');
  const team = screen.getByRole('combobox', { name: 'Team' });
  userEvent.click(team);
  userEvent.click(await screen.findByRole('option', { name: 'IDOL' }));
  await waitFor(() => expect(team).toHaveTextContent('IDOL'));
  const notes = screen.getByRole('textbox', { name: 'Notes' });
  fireEvent.change(notes, { target: { value: 'Line one\nLine two' } });
  expect(notes).toHaveValue('Line one\nLine two');
});

test('breadcrumbs link ancestors and identify the current page without a self-link', () => {
  render(
    <Breadcrumbs
      items={[
        { id: 'home', label: 'Home', href: '/' },
        { id: 'current', label: 'Current', href: '/current' }
      ]}
    />
  );
  expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  expect(screen.getByText('Current').closest('[aria-current]')).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.queryByRole('link', { name: 'Current' })).not.toBeInTheDocument();
});

test('checkboxes toggle from their labels and preserve checked form values', () => {
  render(
    <form aria-label="Preferences">
      <LabelledCheckbox name="updates" value="yes" label="Receive updates" />
      <Checkbox aria-label="Unavailable checkbox" disabled />
    </form>
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Receive updates' });
  userEvent.click(screen.getByText('Receive updates'));
  expect(checkbox).toBeChecked();
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('updates')).toBe('yes');
  userEvent.click(screen.getByRole('checkbox', { name: 'Unavailable checkbox' }));
  expect(screen.getByRole('checkbox', { name: 'Unavailable checkbox' })).not.toBeChecked();
  userEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

test('radio groups select one value, support arrow keys, and exclude disabled choices', async () => {
  render(
    <form aria-label="Team preference">
      <RadioGroup aria-label="Team" name="team" defaultValue="design">
        <LabelledRadio value="design" label="Design" />
        <LabelledRadio value="development" label="Development" />
        <LabelledRadio value="unavailable" label="Unavailable team" disabled />
      </RadioGroup>
    </form>
  );
  const design = screen.getByRole('radio', { name: 'Design' });
  const development = screen.getByRole('radio', { name: 'Development' });
  userEvent.click(design);
  userEvent.keyboard('{ArrowDown}');
  await waitFor(() => expect(development).toBeChecked());
  expect(design).not.toBeChecked();
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('team')).toBe('development');
  userEvent.click(screen.getByText('Unavailable team'));
  expect(development).toBeChecked();
  userEvent.click(screen.getByText('Design'));
  expect(design).toBeChecked();
  expect(development).not.toBeChecked();
});

test('switch labels and Space toggle the submitted value while disabled switches stay off', () => {
  render(
    <form aria-label="Notifications">
      <LabelledSwitch name="notifications" value="enabled" label="Enable notifications" />
      <LabelledSwitch label="Unavailable switch" disabled />
    </form>
  );
  const control = screen.getByRole('switch', { name: 'Enable notifications' });
  userEvent.click(screen.getByText('Enable notifications'));
  expect(control).toBeChecked();
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('notifications')).toBe(
    'enabled'
  );
  userEvent.keyboard(' ');
  expect(control).not.toBeChecked();
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('notifications')).toBe(
    false
  );
  userEvent.click(screen.getByText('Unavailable switch'));
  expect(screen.getByRole('switch', { name: 'Unavailable switch' })).not.toBeChecked();
});

test('modal is labeled, inherits portal theme, closes with Escape, and restores focus', async () => {
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <DesignSystemScope theme="dark">
        <Modal
          id="test-modal"
          title="Details"
          description="Review details"
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>Open details</Button>}
          footer={<ModalClose render={<Button>Cancel</Button>} />}
        />
      </DesignSystemScope>
    );
  }
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open details' });
  userEvent.click(trigger);
  const dialog = await screen.findByRole('dialog', { name: 'Details' });
  expect(dialog).toHaveAccessibleDescription('Review details');
  expect(dialog.closest('[data-idol-theme]')).toHaveAttribute('data-idol-theme', 'dark');
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await waitFor(() => expect(trigger).toHaveFocus());
});
