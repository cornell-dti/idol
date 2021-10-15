export const isProduction = process.env.NODE_ENV === 'production';

/** Switch to true when using prod API for dev. Remember to change it back before commit. */
export const useProdBackendForDev = false;

/** Switch to false to use development Firebase instance. Change back to true before committing. */
export const useProdDb = false;

export const backendURL =
  isProduction || !useProdBackendForDev
    ? '/.netlify/functions/api'
    : 'http://idol.cornelldti.org/.netlify/functions/api';
