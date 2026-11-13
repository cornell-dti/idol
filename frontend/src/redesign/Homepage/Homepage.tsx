import { useEffect, useState } from 'react';
import { useSelf } from '../../components/Common/FirestoreDataProvider';
import CoffeeChatAPI from '../../API/CoffeeChatAPI';
import ShoutoutsAPI from '../../API/ShoutoutsAPI';
import { TeamEventsAPI } from '../../API/TeamEventsAPI';
import TecConfigAPI from '../../API/TecConfigAPI';
import receivedShoutouts from '../Forms/Shoutouts/receivedShoutouts';
import HomepageView from './HomepageView';
import { homeShortcutsStorageKey } from './shortcuts';
import { coffeeMetrics, HomeSummary, tecMetrics } from './summary';

const loading: HomeSummary = { coffee: {}, tec: {}, shoutouts: {} };

export default function Homepage(): JSX.Element {
  const self = useSelf();
  const [summary, setSummary] = useState<HomeSummary>(loading);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setSummary(loading);
    if (!self) return undefined;
    const update = (key: keyof HomeSummary, value: HomeSummary[keyof HomeSummary]) => {
      if (active) setSummary((previous) => ({ ...previous, [key]: value }));
    };
    CoffeeChatAPI.getCoffeeChatsByUser(self, { throwOnError: true })
      .then((chats) => update('coffee', { metrics: coffeeMetrics(chats) }))
      .catch(() => update('coffee', { error: 'Could not load coffee chats.' }));
    Promise.all([
      TeamEventsAPI.getTeamEventAttendanceByUser({ throwOnError: true }),
      TeamEventsAPI.getAllTeamEventInfo({ throwOnError: true }),
      TecConfigAPI.getTecConfig()
    ])
      .then(([attendance, events, config]) =>
        update('tec', { metrics: tecMetrics(attendance, events, config) })
      )
      .catch(() => update('tec', { error: 'Could not load team event credits.' }));
    Promise.all([
      ShoutoutsAPI.getShoutouts(self.email, 'given', { throwOnError: true }),
      ShoutoutsAPI.getAllShoutouts({ throwOnError: true })
    ])
      .then(([sent, all]) =>
        update('shoutouts', {
          metrics: [
            { label: 'Sent', value: sent.length },
            {
              label: 'Received',
              value: receivedShoutouts(all, self.firstName, self.lastName).length
            }
          ]
        })
      )
      .catch(() => update('shoutouts', { error: 'Could not load shoutouts.' }));
    return () => {
      active = false;
    };
  }, [self, attempt]);
  return (
    <HomepageView
      key={self?.email}
      name={self ? `${self.firstName} ${self.lastName}` : ''}
      storageKey={homeShortcutsStorageKey(self?.email)}
      summary={summary}
      onRetry={() => setAttempt((value) => value + 1)}
    />
  );
}
