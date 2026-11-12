import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Head from 'next/head';
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
        scrollWheelZoom={false}
        worldCopyJump
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(({ city, key, count, icon }) => (
          <Marker
            key={key}
            position={[city.latitude, city.longitude]}
            icon={icon}
            title={`${city.locationName}: ${count} ${count === 1 ? 'alum' : 'alumni'}`}
            zIndexOffset={key === selectedKey ? 1000 : 0}
            eventHandlers={{
              click: () => onSelectedKeyChange(key === selectedKey ? null : key)
            }}
          >
            <Popup>
              <div className={styles.popup}>
                <strong>{city.locationName}</strong>
                <span>
                  {count} {count === 1 ? 'alum' : 'alumni'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
