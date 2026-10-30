import { ReactNode, useState } from 'react';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  IconButton,
  Input,
  Select,
  Tab,
  TabRoot,
  TabList,
  TabPanel,
  DesignSystemScope,
  Tabs,
  Textarea
} from './components';
import { ArrowRightIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from './icons';
import ExtendedComponentsPreview from './ExtendedComponentsPreview';
import pageStyles from './TokenPreview.module.css';
import styles from './ComponentsPreview.module.css';

const variants = ['primary', 'secondary', 'danger'] as const;
const plus = <PlusIcon size={16} aria-hidden="true" />;

export default function ComponentsPreview(): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [message, setMessage] = useState('Try a button. Actions stay in this preview.');
  const [email, setEmail] = useState('');
  const [requiredTeam, setRequiredTeam] = useState('');
  const [tab, setTab] = useState('overview');
  const [singleTab, setSingleTab] = useState('first');
  const announce = (action: string) => setMessage(`${action} clicked.`);
  const sampleTabs = [
    {
      value: 'overview',
      label: 'Overview',
      icon: plus,
      content: 'Overview content. The selected tab controls this panel.'
    },
    {
      value: 'activity',
      label: 'Activity',
      icon: plus,
      content: 'Activity content. Move between tabs with the arrow keys.'
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: plus,
      content: 'Settings content. Home and End jump to the first and last tabs.'
    },
    {
      value: 'disabled',
      label: 'Disabled',
      disabled: true,
      content: 'This tab cannot be selected.'
    }
  ];

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
      <div className={styles.toolbar}>
        <label htmlFor="component-theme">Component preview theme</label>
        <select
          id="component-theme"
          value={theme}
          onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      {section(
        'buttons',
        '04',
        'Buttons',
        'Primary, secondary, and danger. Hover, focus, or click to explore.',
        <>
          <div className={styles.threeColumns}>
            {variants.map((variant) => (
              <div key={variant} className={styles.stack}>
                <h3 className="idol-label-default">{variant}</h3>
                <Button
                  variant={variant}
                  icon={variant === 'danger' ? <TrashIcon size={16} aria-hidden="true" /> : plus}
                  onClick={() => announce(variant)}
                >
                  Super Idol Button
                </Button>
                <Button variant={variant} onClick={() => announce(`${variant} text button`)}>
                  Super Idol Button
                </Button>
                <Button variant={variant} disabled>
                  Disabled button
                </Button>
              </div>
            ))}
          </div>
          <p role="status" className={styles.feedback}>
            {message}
          </p>
        </>
      )}
      {section(
        'icon-buttons',
        '05',
        'Icon buttons',
        'Compact actions in 36px, with a 24px tertiary option.',
        <div className={styles.row}>
          <IconButton
            variant="primary"
            icon={plus}
            aria-label="Add primary item"
            onClick={() => announce('Primary icon button')}
          />
          <IconButton
            variant="secondary"
            icon={plus}
            aria-label="Add secondary item"
            onClick={() => announce('Secondary icon button')}
          />
          <IconButton
            variant="tertiary"
            icon={plus}
            aria-label="Add tertiary item"
            onClick={() => announce('Tertiary icon button')}
          />
          <IconButton
            variant="tertiary"
            size={24}
            icon={plus}
            aria-label="Add compact item"
            onClick={() => announce('Compact icon button')}
          />
          <IconButton icon={plus} aria-label="Disabled action" disabled />
          <p className="idol-body-small">{message}</p>
        </div>
      )}
      {section(
        'inputs',
        '06',
        'Inputs',
        'Text, dropdowns, multiline notes, and a larger search field.',
        <div className={styles.fields}>
          <Input id="preview-name" label="Your name" placeholder="Super Idol Input" />
          <Input id="preview-icon" label="With icon" icon={plus} placeholder="Super Idol Input" />
          <Input
            id="preview-email"
            label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={!email.includes('@') ? 'Enter an email address including @.' : undefined}
            placeholder="Super Idol Input"
          />
          <Select
            id="preview-team"
            label="Team"
            icon={plus}
            placeholder="Super Idol Input"
            options={['Design', 'Development', 'Product'].map((value) => ({ value, label: value }))}
          />
          <Select
            id="preview-role"
            label="Role"
            defaultValue="member"
            options={[
              { value: 'member', label: 'Member' },
              { value: 'lead', label: 'Lead' }
            ]}
          />
          <Select
            id="preview-required"
            label="Required selection"
            placeholder="Super Idol Input"
            error={requiredTeam ? undefined : 'Choose a team to continue.'}
            value={requiredTeam || null}
            onValueChange={(value) => setRequiredTeam(value || '')}
            options={[{ value: 'design', label: 'Design' }]}
          />
          <div className={styles.wide}>
            <Input
              id="preview-search"
              label="Search"
              size="large"
              type="search"
              icon={<MagnifyingGlassIcon size={20} aria-hidden="true" />}
              placeholder="Super Idol Input"
            />
          </div>
          <Textarea
            id="preview-notes"
            label="Notes"
            placeholder="Super Idol Input"
            hint="This is a local preview. Nothing is submitted."
          />
          <Input id="preview-disabled" label="Disabled input" placeholder="Unavailable" disabled />
        </div>
      )}
      {section(
        'cards',
        '07',
        'Cards',
        'A simple surface or a layered header, with column and row layouts.',
        <div className={styles.cardGrid}>
          {(['column', 'row'] as const).map((direction) => (
            <Card key={direction} direction={direction} className={styles.demoCard}>
              <div className={styles.cardSlot}>Your content goes here</div>
              <p className="idol-body-small">
                {direction === 'column' ? 'Column layout' : 'Row layout'}
              </p>
            </Card>
          ))}
          {(['column', 'row'] as const).map((direction) => (
            <Card
              key={direction}
              direction={direction}
              className={styles.demoCard}
              header="Label"
              action={
                <IconButton
                  variant="tertiary"
                  size={24}
                  icon={<ArrowRightIcon size={16} aria-hidden="true" />}
                  aria-label={`Open ${direction} card`}
                  onClick={() => announce(`${direction} card`)}
                />
              }
            >
              <div className={styles.cardSlot}>Your content goes here</div>
              <p className="idol-body-small">
                {direction === 'column' ? 'Column layout' : 'Row layout'}
              </p>
            </Card>
          ))}
          <p className="idol-body-small">{message}</p>
        </div>
      )}
      {section(
        'breadcrumb-items',
        '08',
        'Breadcrumb items',
        'Default, hover, and current-page treatments, with optional icons.',
        <div className={styles.row}>
          <BreadcrumbItem href="#breadcrumb-items" icon={plus}>
            Breadcrumb 1
          </BreadcrumbItem>
          <BreadcrumbItem href="#breadcrumb-items">Breadcrumb 1</BreadcrumbItem>
          <BreadcrumbItem current icon={plus}>
            Breadcrumb 1
          </BreadcrumbItem>
          <BreadcrumbItem current>Breadcrumb 1</BreadcrumbItem>
        </div>
      )}
      {section(
        'breadcrumbs',
        '09',
        'Breadcrumbs',
        'One to four levels. The final item identifies the current page.',
        <div className={styles.stack}>
          {[1, 2, 3, 4].map((count) => (
            <Breadcrumbs
              key={count}
              label={`${count}-level breadcrumb`}
              items={Array.from({ length: count }, (_, index) => ({
                id: String(index),
                label: `Breadcrumb ${index + 1}`,
                href: '#breadcrumbs',
                icon: plus
              }))}
            />
          ))}
        </div>
      )}
      {section(
        'tab',
        '10',
        'Tab',
        'Individual tab states, composed into an accessible tab list.',
        <TabRoot value={singleTab} onValueChange={setSingleTab}>
          <TabList aria-label="Individual tab examples" className={styles.row} activateOnFocus>
            <Tab value="first" icon={plus}>
              Tab 1
            </Tab>
            <Tab value="second" icon={plus}>
              Tab 2
            </Tab>
          </TabList>
          <TabPanel value="first" className={styles.feedback}>
            First tab content.
          </TabPanel>
          <TabPanel value="second" className={styles.feedback}>
            Second tab content.
          </TabPanel>
        </TabRoot>
      )}
      {section(
        'tabs',
        '11',
        'Tabs',
        'A segmented tab group with arrow-key navigation and linked content.',
        <Tabs
          id="preview-tabs"
          label="Example content"
          items={sampleTabs}
          value={tab}
          onValueChange={setTab}
        />
      )}
      <ExtendedComponentsPreview theme={theme} />
    </>
  );
}
