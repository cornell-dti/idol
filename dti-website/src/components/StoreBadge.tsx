import AppStoreBadge from '../assets/stores/app-store.svg';
import GooglePlayBadge from '../assets/stores/google-play.svg';

type Props = { readonly store: 'appstore' | 'playstore'; readonly url: string };

export default function StoreBadge({ store, url }: Props): JSX.Element {
  return (
    <a href={url}>
      {store === 'appstore' ? <AppStoreBadge /> : <GooglePlayBadge />}
    </a>
  );
}
