import { useDesignSystemTheme } from '../design-system-2026/components/Theme/Theme';
import productLogos, { productLogosOnLight } from './helpProductLogos';

/**
 * A product's logo for a themed tile. Logos drawn for dark surfaces (white wordmarks) swap to
 * their light-surface variant under the light theme.
 */
export default function ProductLogo({ id, size }: { id: string; size: number }): JSX.Element {
  const theme = useDesignSystemTheme();
  const src = (theme === 'light' && productLogosOnLight[id]) || productLogos[id];
  return <img src={src} alt="" width={size} height={size} />;
}
