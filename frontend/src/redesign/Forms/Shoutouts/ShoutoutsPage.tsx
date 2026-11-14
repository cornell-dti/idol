import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { HandArrowUpIcon } from '@phosphor-icons/react/dist/csr/HandArrowUp';
import { HandArrowDownIcon } from '@phosphor-icons/react/dist/csr/HandArrowDown';
import {
  Button,
  Card,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabRoot
} from '../../../design-system-2026/components';
import { MagnifyingGlassIcon } from '../../../design-system-2026/icons';
import {
  useHasAdminPermission,
  useMembers,
  useSelf
} from '../../../components/Common/FirestoreDataProvider';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ShoutoutForm from './ShoutoutForm';
import ShoutoutCard from './ShoutoutCard';
import styles from './Shoutouts.module.css';
import receivedShoutouts from './receivedShoutouts';

type View = 'given' | 'received';

// Survives navigating away so returning to the page shows the last lists
// immediately while they refresh in the background.
const historyCache = new Map<string, { given: Shoutout[] | null; received: Shoutout[] | null }>();

export default function ShoutoutsPage(): JSX.Element {
  const user = useSelf();
  const members = useMembers();
  const isAdmin = useHasAdminPermission();
  const email = user?.email;
  const firstName = user?.firstName.toLowerCase() ?? '';
  const lastName = user?.lastName.toLowerCase() ?? '';
  const cached = email ? historyCache.get(email) : undefined;
  // null = not loaded yet; only then do we show the skeleton.
  const [given, setGiven] = useState<Shoutout[] | null>(cached?.given ?? null);
  const [received, setReceived] = useState<Shoutout[] | null>(cached?.received ?? null);
  const [view, setView] = useState<View>('given');
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState<Partial<Record<View, string>>>({});
  const request = useRef(0);

  useEffect(() => {
    if (!email) return;
    const saved = historyCache.get(email);
    historyCache.set(email, {
      given: given ?? saved?.given ?? null,
      received: received ?? saved?.received ?? null
    });
  }, [email, given, received]);

  const refresh = useCallback(() => {
    if (!email) return;
    request.current += 1;
    const version = request.current;
    setErrors({});
    // The signed-in user can arrive after the first render, so seed from the
    // cache here too.
    const saved = historyCache.get(email);
    setGiven((current) => current ?? saved?.given ?? null);
    setReceived((current) => current ?? saved?.received ?? null);
    // Load each list on its own so Given isn't held up by the much slower
    // all-shoutouts request that Received depends on.
    const load = (type: View, fetch: () => Promise<Shoutout[]>, set: (items: Shoutout[]) => void) =>
      fetch()
        .then((items) => {
          if (request.current === version) set(items);
        })
        .catch(() => {
          if (request.current === version)
            setErrors((current) => ({
              ...current,
              [type]: 'Couldn’t load your shoutouts. Please try again.'
            }));
        });
    load(
      'given',
      () => ShoutoutsAPI.getShoutouts(email, 'given', { throwOnError: true }),
      setGiven
    );
    load(
      'received',
      () =>
        ShoutoutsAPI.getAllShoutouts({ throwOnError: true }).then((all) =>
          receivedShoutouts(all, firstName, lastName)
        ),
      setReceived
    );
  }, [email, firstName, lastName]);

  useEffect(() => {
    refresh();
    return () => {
      request.current += 1;
    };
  }, [refresh]);

  const update = (shoutout: Shoutout) => {
    const replace = (items: Shoutout[] | null) =>
      items?.map((item) => (item.uuid === shoutout.uuid ? shoutout : item)) ?? null;
    setGiven(replace);
    setReceived(replace);
  };
  const remove = (uuid: string) => {
    const exclude = (items: Shoutout[] | null) =>
      items?.filter((item) => item.uuid !== uuid) ?? null;
    setGiven(exclude);
    setReceived(exclude);
  };
  const history = (type: View) => {
    const items = type === 'given' ? given : received;
    const error = errors[type];
    if (error && !items)
      return (
        <Card>
          <div className={styles.empty} role="alert">
            <p>{error}</p>
            <Button variant="secondary" onClick={refresh}>
              Try again
            </Button>
          </div>
        </Card>
      );
    if (!items)
      return (
        <div className={styles.skeletonList} role="status" aria-label="Loading shoutouts">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className={`${styles.skeleton} idol-skeleton`} aria-hidden="true" />
          ))}
        </div>
      );
    const normalized = query.trim().toLowerCase();
    const matches = items
      .filter((item) => {
        const from = item.isAnon
          ? 'anonymous'
          : `${item.giver?.firstName ?? ''} ${item.giver?.lastName ?? ''}`;
        return [item.receiver, item.message, from, ...(item.tags ?? [])].some((text) =>
          text.toLowerCase().includes(normalized)
        );
      })
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp);
    const emptyMessage =
      type === 'given'
        ? 'Make someone’s day. Send your first shoutout above!'
        : 'Shoutouts that mention you will appear here.';
    if (!matches.length)
      return (
        <Card>
          <div className={styles.empty} role="status">
            <h3>{normalized ? 'No matching shoutouts' : 'No shoutouts yet'}</h3>
            <p>{normalized ? 'Try another name or phrase.' : emptyMessage}</p>
            {normalized && (
              <Button variant="secondary" onClick={() => setQuery('')}>
                Clear search
              </Button>
            )}
          </div>
        </Card>
      );
    return (
      // eslint-disable-next-line jsx-a11y/no-redundant-roles -- Safari needs this when list markers are hidden.
      <ul className={styles.historyList} role="list">
        {matches.map((shoutout) => (
          <li key={shoutout.uuid}>
            <ShoutoutCard
              shoutout={shoutout}
              own={shoutout.giver?.email === email}
              canManage={isAdmin || shoutout.giver?.email === email}
              onUpdate={update}
              onDelete={remove}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Shoutouts · IDOL</title>
      </Head>
      <h1 className="idol-heading-1">Shoutouts</h1>
      {user && <ShoutoutForm user={user} members={members} onSent={refresh} />}
      <section className={styles.history} aria-labelledby="shoutout-history-title">
        <h2 id="shoutout-history-title" className="idol-heading-2">
          History
        </h2>
        <TabRoot value={view} onValueChange={(value) => setView(value as View)}>
          <div className={styles.toolbar}>
            <TabList className={styles.tabs} aria-label="Shoutout history">
              <Tab value="given" icon={<HandArrowUpIcon size={16} />}>
                Given
              </Tab>
              <Tab value="received" icon={<HandArrowDownIcon size={16} />}>
                Received
              </Tab>
            </TabList>
            <div className={styles.search}>
              <Input
                id="shoutout-search"
                aria-label="Search shoutout history"
                placeholder="Search"
                icon={<MagnifyingGlassIcon size={16} />}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <TabPanel value="given" className={styles.panel}>
            {history('given')}
          </TabPanel>
          <TabPanel value="received" className={styles.panel}>
            {history('received')}
          </TabPanel>
        </TabRoot>
      </section>
    </div>
  );
}
