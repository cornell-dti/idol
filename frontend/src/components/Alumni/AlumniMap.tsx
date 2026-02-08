import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './Alumni.module.css';

type MapComponentsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MapContainer: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TileLayer: React.ComponentType<any>;
} | null;

const AlumniMap: React.FC = () => {
  const [MapComponents, setMapComponents] = useState<MapComponentsType>(null);

  useEffect(() => {
    import('react-leaflet').then((mod) => {
      setMapComponents({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer
      });
    });
  }, []);

  const center: [number, number] = [39.8283, -98.5795];
  const zoom = 4;

  if (!MapComponents) {
    return <div className={styles.mapContainer}>Loading map...</div>;
  }

  const { MapContainer, TileLayer } = MapComponents;

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
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </>
  );
};

export default AlumniMap;
