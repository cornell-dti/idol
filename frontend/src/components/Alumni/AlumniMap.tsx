import { MapContainer, TileLayer } from 'react-leaflet';
import Head from 'next/head';
import styles from './Alumni.module.css';

const AlumniMap: React.FC = () => {
  const center: [number, number] = [39.8283, -98.5795];
  const zoom = 4;

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
      </MapContainer>
    </>
  );
};

export default AlumniMap;
