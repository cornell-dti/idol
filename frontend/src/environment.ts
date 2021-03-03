export const isProduction = process.env.NODE_ENV === 'production';

/** Switch to true when using prod API for dev. Remember to change it back before commit. */
const useProdBackendForDev = false;

export const backendURL =
  isProduction || !useProdBackendForDev
    ? '/.netlify/functions/api'
    : 'http://idol.cornelldti.org/.netlify/functions/api';
