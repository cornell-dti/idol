import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Combobox } from '@base-ui/react/combobox';
import { Input } from '../../design-system-2026/components/Input/Input';
import { useDesignSystemAppearance } from '../../design-system-2026/components/Theme/Theme';
import { ArrowRightIcon, MagnifyingGlassIcon } from '../../design-system-2026/icons';
import { shortcuts, ShortcutId } from './shortcuts';
import selectStyles from '../../design-system-2026/components/Select/Select.module.css';
import styles from './HomeSearch.module.css';

const aliases: Record<ShortcutId, string> = {
  shoutouts: 'shout outs appreciation thanks kudos sent received',
  tec: 'tec tecs team events credits attendance',
  profile: 'account personal information bio photo social links',
  coffee: 'coffee chat chats bingo',
  portfolio: 'dev developer development portfolio assignments github pr prs pull requests',
  alumni: 'alumni graduates former members'
};
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export default function HomeSearch(): JSX.Element {
  const router = useRouter();
  const { theme, accent } = useDesignSystemAppearance();
  const anchor = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  return (
    <Combobox.Root<(typeof shortcuts)[number]>
      items={shortcuts}
      value={null}
      inputValue={query}
      onInputValueChange={(value, details) => {
        setQuery(value);
        if (details.reason === 'input-change') setOpen(normalize(value).length > 0);
      }}
      open={open && normalize(query).length > 0}
      onOpenChange={setOpen}
      autoHighlight
      itemToStringLabel={(item) => item.label}
      filter={(item, search) => {
        const haystack = normalize(`${item.label} ${item.description} ${aliases[item.id]}`);
        return normalize(search)
          .split(' ')
          .every((word) => haystack.includes(word));
      }}
      onValueChange={(item) => {
        if (!item) return;
        setOpen(false);
        setQuery('');
        router.push(item.href);
      }}
    >
      <div ref={anchor}>
        <Combobox.Input
          render={
            <Input
              id="home-search"
              aria-label="Search or find common actions"
              size="large"
              shape="pill"
              placeholder="Search or find common actions"
              icon={<MagnifyingGlassIcon size={20} aria-hidden />}
            />
          }
        />
      </div>
      <Combobox.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
        <Combobox.Positioner
          anchor={anchor}
          sideOffset={8}
          className={selectStyles.selectPositioner}
        >
          <Combobox.Popup className={`${selectStyles.selectPopup} ${styles.popup}`}>
            <Combobox.Empty className={styles.empty}>
              No matching actions. Try a different search.
            </Combobox.Empty>
            <Combobox.List aria-label="Matching actions">
              {(item: (typeof shortcuts)[number]) => (
                <Combobox.Item
                  key={item.id}
                  value={item}
                  className={`${selectStyles.selectOption} ${styles.option}`}
                >
                  <span className={styles.icon}>
                    <item.icon size={16} aria-hidden />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.description}>{item.description}</span>
                  </span>
                  <ArrowRightIcon size={16} aria-hidden />
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
