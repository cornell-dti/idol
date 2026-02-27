import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Head from 'next/head';
import styles from './Alumni.module.css';

interface AlumniMapProps {
  visibleCityCoordinates: readonly CityCoordinates[];
  selectedCityCoordinates: readonly CityCoordinates[];
  onCitySelect: (cityCoordinates: CityCoordinates) => void;
  onCityDeselect: (cityCoordinates: CityCoordinates) => void;
}

const AlumniMap: React.FC<AlumniMapProps> = ({
  visibleCityCoordinates,
  selectedCityCoordinates,
  onCitySelect,
  onCityDeselect
}) => {
  const center: [number, number] = [39.8283, -98.5795];
  const zoom = 4;

  const selectedSet = useMemo(
    () => new Set(selectedCityCoordinates.map((c) => `${c.latitude},${c.longitude}`)),
    [selectedCityCoordinates]
  );

  const defaultIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [20, 33],
        iconAnchor: [10, 33],
        popupAnchor: [0, -28],
        shadowSize: [33, 33]
      }),
    []
  );

  const selectedIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [20, 33],
        iconAnchor: [10, 33],
        popupAnchor: [0, -28],
        shadowSize: [33, 33]
      }),
    []
  );

  const handlePinClick = (cityCoordinates: CityCoordinates) => {
    const key = `${cityCoordinates.latitude},${cityCoordinates.longitude}`;
    if (selectedSet.has(key)) {
      onCityDeselect(cityCoordinates);
    } else {
      onCitySelect(cityCoordinates);
    }
  };

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
      <MapContainer center={center} zoom={zoom} className={styles.mapContainer} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visibleCityCoordinates.map((city) => {
          const key = `${city.latitude},${city.longitude}`;
          const isSelected = selectedSet.has(key);
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
