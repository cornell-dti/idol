import { ReactNode, useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  LabelledCheckbox,
  RadioGroup,
  LabelledRadio,
  Switch,
  LabelledSwitch,
  Link,
  DesignSystemScope,
  Menu,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  Modal,
  ModalClose,
  Pill,
  Sidebar,
  SidebarItem
} from './components';
import {
  TrashIcon,
  CalendarBlankIcon,
  CalendarIcon,
  CodeIcon,
  CoffeeIcon,
  GearIcon,
  GraduationCapIcon,
  HouseIcon,
  LinkIcon,
  ListChecksIcon,
  MegaphoneIcon,
  PlusIcon,
  QuestionIcon,
  RocketLaunchIcon,
  ScalesIcon,
  UserIcon,
  UsersIcon
} from './icons';
import type { Icon } from './icons';
import { Theme } from './components/Theme/Theme';
import { SidebarSection } from './components/Sidebar/Sidebar';
import pageStyles from './TokenPreview.module.css';
import styles from './ComponentsPreview.module.css';

const mainEntries: [string, Icon][] = [
  ['Home', HouseIcon],
  ['Shoutouts', MegaphoneIcon],
  ['Team Event Credits', CalendarBlankIcon],
  ['Coffee Chats', CoffeeIcon],
  ['Dev Portfolio', CodeIcon],
  ['Alumni', GraduationCapIcon]
];
const adminEntries: [string, Icon][] = [
  ['Member Information Review', ListChecksIcon],
  ['Site Deployer', RocketLaunchIcon],
  ['Sign-in Creator', LinkIcon],
  ['View Shoutouts', MegaphoneIcon],
  ['Edit Users', UserIcon],
  ['Edit Teams', UsersIcon],
  ['Edit Team Events', CalendarBlankIcon],
  ['Edit Candidate Deciders', ScalesIcon],
  ['Dev Portfolios', CodeIcon],
  ['Review Coffee Chats', CoffeeIcon],
  ['Edit Interview Scheduler', CalendarIcon],
  ['Edit Alumni', GraduationCapIcon]
];
function SidebarDemo({
  theme,
  initialMinimized,
  id
}: {
  theme: Theme;
  initialMinimized: boolean;
  id: string;
}) {
  const [minimized, setMinimized] = useState(initialMinimized);
  const [selected, setSelected] = useState('Home');
  const entries = (values: [string, Icon][]) =>
    values.map(([label, IconComponent]) => ({
      id: label,
      label,
      selected: label === selected,
      icon: <IconComponent size={16} aria-hidden="true" />,
      onClick: () => setSelected(label)
    }));
  const sections: SidebarSection[] = [
    { id: 'main', label: 'Main', items: entries(mainEntries) },
    { id: 'admin', label: 'Admin', items: entries(adminEntries) }
  ];
  return (
    <div className={styles.sidebarExample}>
      <Sidebar
        id={id}
        label={`${theme} ${initialMinimized ? 'compact' : 'expanded'} sidebar`}
        theme={theme}
        sections={sections}
        footerItems={entries([
          ['Help', QuestionIcon],
          ['Settings', GearIcon]
        ])}
        minimized={minimized}
        onMinimizedChange={setMinimized}
        profile={{ name: 'Preview Member', onClick: () => setSelected('Profile') }}
      />
      <p className="idol-body-small" role="status">
        {selected}
      </p>
    </div>
  );
}
export default function ExtendedComponentsPreview({ theme }: { theme: Theme }): JSX.Element {
  const [menuAction, setMenuAction] = useState('Choose an action from the menu.');
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState('design');
  const [notifications, setNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [itemMessage, setItemMessage] = useState('Try a sidebar item.');
  const section = (
    id: string,
    number: string,
    title: string,
    description: string,
    children: ReactNode
  ) => (
    <section id={id} className={pageStyles.foundationSection} aria-labelledby={`${id}-title`}>
      <div className={pageStyles.sectionHeading}>
        <div>
          <p className={pageStyles.eyebrow}>{number} / Components</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p className={pageStyles.description}>{description}</p>
        </div>
      </div>
      <DesignSystemScope theme={theme} className={styles.canvas}>
        {children}
      </DesignSystemScope>
    </section>
  );
  return (
    <>
      {section(
        'checkboxes',
        '12',
        'Checkboxes',
        '18px controls with hover, keyboard focus, and disabled states.',
        <div className={styles.row}>
          <Checkbox aria-label="Unchecked example" />
          <Checkbox aria-label="Checked example" defaultChecked />
          <Checkbox aria-label="Disabled unchecked example" disabled />
          <Checkbox aria-label="Disabled checked example" defaultChecked disabled />
        </div>
      )}
      {section(
        'labelled-checkboxes',
        '13',
        'Labeled checkboxes',
        'Click the label or press Space to change the selection.',
        <div className={styles.stack}>
          <LabelledCheckbox label="Checkbox label" checked={checked} onCheckedChange={setChecked} />
          <LabelledCheckbox label="Selected checkbox" defaultChecked />
          <LabelledCheckbox label="Unavailable option" disabled />
          <p className="idol-body-small" role="status">
            {checked ? 'Selected' : 'Not selected'}
          </p>
        </div>
      )}
      {section(
        'pills',
        '14',
        'Pills',
        'Accent, red, and green status labels.',
        <div className={styles.row}>
          {(['accent', 'red', 'green'] as const).map((color) => (
            <Pill key={color} color={color}>
              Pill label
            </Pill>
          ))}
        </div>
      )}
      {section(
        'modals',
        '15',
        'Modal',
        'A layered dialog with focus management and keyboard dismissal.',
        <>
          <Modal
            id="preview-modal"
            open={open}
            onOpenChange={setOpen}
            trigger={<Button>Open modal</Button>}
            title="More details here"
            description="Some description of the modal"
            footer={
              <>
                <ModalClose render={<Button variant="secondary">Cancel</Button>} />
                <Button
                  icon={<PlusIcon size={16} aria-hidden="true" />}
                  onClick={() => {
                    setSaved(true);
                    setOpen(false);
                  }}
                >
                  CTA button
                </Button>
              </>
            }
          />
          <p className={styles.feedback} role="status">
            {saved
              ? 'Preview action completed.'
              : 'Try opening the modal. Actions stay in this preview.'}
          </p>
        </>
      )}
      {section(
        'avatars',
        '16',
        'Avatars',
        '32px and 96px circles with placeholder initials.',
        <div className={styles.row}>
          {['Alex Morgan', 'Sam Lee', 'Jordan Kim'].map((name) => (
            <div key={name} className={styles.row}>
              <Avatar name={name} />
              <Avatar name={name} size={96} />
            </div>
          ))}
        </div>
      )}
      {section(
        'modal-backdrop',
        '17',
        'Modal backdrop',
        '50% black overlay. Open the modal to see it over the page.',
        <div className={styles.backdropSample} aria-label="50% black backdrop sample" />
      )}
      {section(
        'sidebar-items',
        '18',
        'Sidebar items',
        'Default and profile items, expanded and minimized.',
        <div className={styles.row}>
          {[false, true].map((minimized) => (
            <div key={String(minimized)} className={styles.stack}>
              {[false, true].map((selected) => (
                <SidebarItem
                  key={String(selected)}
                  label="Sidebar item"
                  icon={<PlusIcon size={16} aria-hidden="true" />}
                  selected={selected}
                  minimized={minimized}
                  onClick={() => setItemMessage('Sidebar item clicked.')}
                />
              ))}
              {[false, true].map((selected) => (
                <SidebarItem
                  key={String(selected)}
                  label="Sidebar item"
                  secondaryLabel="Secondary label"
                  size="large"
                  icon={<Avatar name="Preview Member" decorative />}
                  selected={selected}
                  minimized={minimized}
                  onClick={() => setItemMessage('Sidebar item clicked.')}
                />
              ))}
            </div>
          ))}
          <p className="idol-body-small" role="status">
            {itemMessage}
          </p>
        </div>
      )}
      {section(
        'sidebar-preview',
        '19',
        'Sidebar',
        'Search, select a page, and collapse or expand. All navigation stays in this preview.',
        <div className={styles.sidebarExamples}>
          {(['light', 'dark'] as const).map((mode) =>
            [false, true].map((minimized) => (
              <SidebarDemo
                key={`${mode}-${minimized}`}
                id={`sidebar-${mode}-${minimized}`}
                theme={mode}
                initialMinimized={minimized}
              />
            ))
          )}
        </div>
      )}
      {section(
        'radio-buttons',
        '20',
        'Radio buttons',
        'Choose one option. Use the arrow keys to move within a group.',
        <div className={styles.row}>
          <RadioGroup
            aria-label="Choose a team"
            name="preview-radio-team"
            value={radio}
            onValueChange={setRadio}
          >
            <LabelledRadio value="design" label="Design" />
            <LabelledRadio value="development" label="Development" />
            <LabelledRadio value="product" label="Product" />
            <LabelledRadio value="unavailable" label="Unavailable team" disabled />
          </RadioGroup>
          <RadioGroup aria-label="Disabled selection" defaultValue="selected" disabled>
            <LabelledRadio value="selected" label="Disabled selected" disabled />
            <LabelledRadio value="unselected" label="Disabled unselected" disabled />
          </RadioGroup>
        </div>
      )}
      {section(
        'switches',
        '21',
        'Switches',
        'Toggle with a click or Space. The thumb follows the selected state.',
        <div className={styles.stack}>
          <div className={styles.row}>
            <Switch aria-label="Off example" />
            <Switch aria-label="On example" defaultChecked />
            <Switch aria-label="Disabled off example" disabled />
            <Switch aria-label="Disabled on example" defaultChecked disabled />
          </div>
          <LabelledSwitch
            label="Enable notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <p className="idol-body-small" role="status">
            Notifications {notifications ? 'on' : 'off'}
          </p>
        </div>
      )}
      {section(
        'links',
        '22',
        'Links',
        'Accent-colored links for inline text and navigation.',
        <div className={styles.stack}>
          <p className="idol-body-default">
            Explore the <Link href="/design-system-2026/shell">app shell</Link> to see the shared
            layout.
          </p>
          <Link href="#colors">View color tokens</Link>
        </div>
      )}
      {section(
        'menus',
        '23',
        'Menus',
        'Action menus with keyboard navigation, groups, and disabled or destructive actions.',
        <div className={styles.stack}>
          <Menu trigger={<Button variant="secondary">Actions</Button>}>
            <MenuGroup label="Page actions">
              <MenuItem
                icon={<PlusIcon size={16} />}
                onClick={() => setMenuAction('Duplicate selected.')}
              >
                Duplicate
              </MenuItem>
              <MenuItem onClick={() => setMenuAction('Archive selected.')}>Archive</MenuItem>
              <MenuItem disabled>Move to another team</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuItem
              variant="danger"
              icon={<TrashIcon size={16} />}
              onClick={() => setMenuAction('Delete selected (preview only).')}
            >
              Delete
            </MenuItem>
          </Menu>
          <p className="idol-body-small" role="status">
            {menuAction}
          </p>
        </div>
      )}
    </>
  );
}
