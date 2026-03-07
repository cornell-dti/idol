import { useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Head from 'next/head';
import styles from './Alumni.module.css';

interface AlumniMapProps {
  visibleCityCoordinates: readonly CityCoordinates[];
  selectedCityCoordinates: CityCoordinates | null;
  onCitySelect: (cityCoordinates: CityCoordinates) => void;
  onCityDeselect: () => void;
}

const defaultIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [0, -28],
  shadowSize: [33, 33]
});

const selectedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [0, -28],
  shadowSize: [33, 33]
});

const AlumniMap: React.FC<AlumniMapProps> = ({
  visibleCityCoordinates,
  selectedCityCoordinates,
  onCitySelect,
  onCityDeselect
}) => {
  const center: [number, number] = [39.8283, -98.5795];
  const zoom = 4;

  const selectedKey = useMemo(
    () =>
      selectedCityCoordinates
        ? `${selectedCityCoordinates.latitude},${selectedCityCoordinates.longitude}`
        : null,
    [selectedCityCoordinates]
  );

  const handlePinClick = useCallback(
    (cityCoordinates: CityCoordinates) => {
      const key = `${cityCoordinates.latitude},${cityCoordinates.longitude}`;
      if (selectedKey === key) {
        onCityDeselect();
      } else {
        onCitySelect(cityCoordinates);
      }
    },
    [selectedKey, onCitySelect, onCityDeselect]
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
        center={center}
        zoom={zoom}
        className={styles.mapContainer}
        scrollWheelZoom
        worldCopyJump
        minZoom={2}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visibleCityCoordinates.map((city) => {
          const key = `${city.latitude},${city.longitude}`;
          const isSelected = selectedKey === key;
          const alumniCount = city.alumniIds.length;

          return (
            <Marker
              key={key}
              position={[city.latitude, city.longitude]}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => handlePinClick(city)
              }}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <strong>{city.locationName}</strong>
                  <br />
                  {alumniCount} {alumniCount === 1 ? 'alumnus' : 'alumni'}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default AlumniMap;
