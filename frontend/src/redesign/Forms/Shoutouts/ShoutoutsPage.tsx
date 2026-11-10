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

export default function ShoutoutsPage(): JSX.Element {
  const user = useSelf();
  const members = useMembers();
  const isAdmin = useHasAdminPermission();
  const [given, setGiven] = useState<Shoutout[]>([]);
  const [received, setReceived] = useState<Shoutout[]>([]);
  const [view, setView] = useState<View>('given');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef(0);
  const email = user?.email;
  const firstName = user?.firstName.toLowerCase() ?? '';
  const lastName = user?.lastName.toLowerCase() ?? '';

  const refresh = useCallback(async () => {
    if (!email) return;
    request.current += 1;
    const version = request.current;
    setLoading(true);
    setError('');
    try {
      const [sent, all] = await Promise.all([
        ShoutoutsAPI.getShoutouts(email, 'given', { throwOnError: true }),
        ShoutoutsAPI.getAllShoutouts({ throwOnError: true })
      ]);
      if (request.current !== version) return;
      setGiven(sent);
      setReceived(receivedShoutouts(all, firstName, lastName));
    } catch {
      if (request.current === version) setError('Couldn’t load your shoutouts. Please try again.');
    } finally {
      if (request.current === version) setLoading(false);
    }
  }, [email, firstName, lastName]);

  useEffect(() => {
    refresh();
    return () => {
      request.current += 1;
    };
  }, [refresh]);

  const update = (shoutout: Shoutout) => {
    const replace = (items: Shoutout[]) =>
      items.map((item) => (item.uuid === shoutout.uuid ? shoutout : item));
    setGiven(replace);
    setReceived(replace);
  };
  const remove = (uuid: string) => {
    const exclude = (items: Shoutout[]) => items.filter((item) => item.uuid !== uuid);
    setGiven(exclude);
    setReceived(exclude);
  };
  const history = (type: View) => {
    const normalized = query.trim().toLowerCase();
    const matches = (type === 'given' ? given : received)
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
    if (loading)
      return (
        <div className={styles.skeletonGrid} role="status" aria-label="Loading shoutouts">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className={`${styles.skeleton} idol-skeleton`} aria-hidden="true" />
          ))}
        </div>
      );
    if (error)
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
      <div className={styles.cards}>
        {matches.map((shoutout) => (
          <ShoutoutCard
            key={shoutout.uuid}
            shoutout={shoutout}
            own={shoutout.giver?.email === email}
            canManage={isAdmin || shoutout.giver?.email === email}
            onUpdate={update}
            onDelete={remove}
          />
        ))}
      </div>
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
