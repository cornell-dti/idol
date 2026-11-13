import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Head from 'next/head';
import { IconButton } from '../../design-system-2026/components';
import { XIcon } from '../../design-system-2026/icons';
import cityKey from './cityKey';
import styles from './Alumni.module.css';

type Props = {
  readonly cities: readonly CityCoordinates[];
  /** Alumni per city after filters, so pins show what the list below shows. */
  readonly counts: ReadonlyMap<string, number>;
  readonly selectedKey: string | null;
  readonly onSelectedKeyChange: (key: string | null) => void;
};

const CENTER: [number, number] = [39.8283, -98.5795];

function pin(count: number, selected: boolean): L.DivIcon {
  const width = count > 99 ? 36 : 28;
  return L.divIcon({
    className: styles.pinRoot,
    html: `<span class="${styles.pin} ${selected ? styles.pinSelected : ''}">${count}</span>`,
    iconSize: [width, 28],
    iconAnchor: [width / 2, 14],
    popupAnchor: [0, -16]
  });
}

/** Closes the open popup when the city filter is cleared from outside the map. */
function ClosePopupWhenCleared({ selectedKey }: { selectedKey: string | null }): null {
  const map = useMap();
  useEffect(() => {
    if (selectedKey === null) map.closePopup();
  }, [map, selectedKey]);
  return null;
}

/**
 * Wheel zoom only while ⌘ (Mac) or Ctrl (Windows/Linux) is held, so plain scrolling still scrolls
 * the page. Trackpad pinch also arrives as a Ctrl+wheel event, so it zooms too. Leaflet's own
 * handler does the zooming (and preventDefault stops the browser's page zoom); this capture-phase
 * listener just keeps unmodified wheel events from ever reaching it.
 */
function ModifierWheelZoom(): null {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const onWheel = (event: WheelEvent) => {
      if (!event.metaKey && !event.ctrlKey) event.stopImmediatePropagation();
    };
    container.addEventListener('wheel', onWheel, { capture: true });
    return () => container.removeEventListener('wheel', onWheel, { capture: true });
  }, [map]);
  return null;
}

function ClosePopupButton({ label }: { label: string }): JSX.Element {
  const map = useMap();
  return (
    <IconButton
      variant="tertiary"
      size={24}
      aria-label={`Close ${label}`}
      icon={<XIcon size={14} />}
      className={styles.popupClose}
      onClick={() => map.closePopup()}
    />
  );
}

export default function AlumniMap({
  cities,
  counts,
  selectedKey,
  onSelectedKeyChange
}: Props): JSX.Element {
  const markers = useMemo(
    () =>
      cities.map((city) => {
        const key = cityKey(city);
        const count = counts.get(key) ?? 0;
        return { city, key, count, icon: pin(count, key === selectedKey) };
      }),
    [cities, counts, selectedKey]
  );
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>
      <MapContainer
        center={CENTER}
        zoom={4}
        minZoom={2}
        scrollWheelZoom
        worldCopyJump
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ModifierWheelZoom />
        <ClosePopupWhenCleared selectedKey={selectedKey} />
        {markers.map(({ city, key, count, icon }) => (
          <Marker
            key={key}
            position={[city.latitude, city.longitude]}
            icon={icon}
            title={`${city.locationName}: ${count} ${count === 1 ? 'alum' : 'alumni'}`}
            zIndexOffset={key === selectedKey ? 1000 : 0}
            // The filter follows the popup: closing it (map click, ×, Escape) clears the city.
            // Leaflet closes the old popup before opening the next, so switching pins lands on the new one.
            eventHandlers={{
              popupopen: () => onSelectedKeyChange(key),
              popupclose: () => {
                if (key === selectedKey) onSelectedKeyChange(null);
              }
            }}
          >
            <Popup closeButton={false} minWidth={140} maxWidth={260}>
              <div className={styles.popup}>
                <div className={styles.popupText}>
                  <strong>{city.locationName}</strong>
                  <span>
                    {count} {count === 1 ? 'alum' : 'alumni'}
                  </span>
                </div>
                <ClosePopupButton label={city.locationName} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
