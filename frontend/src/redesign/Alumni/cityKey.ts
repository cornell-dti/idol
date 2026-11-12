/** Stable id for a city pin; coordinates are unique per city. */
const cityKey = (city: CityCoordinates): string => `${city.latitude},${city.longitude}`;

export default cityKey;
