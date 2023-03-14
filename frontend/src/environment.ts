export const isProduction = process.env.NODE_ENV === 'production';

export const isStaging: boolean = JSON.parse(process.env.NEXT_PUBLIC_IS_STAGING as string);

/** Switch to true when using prod API for dev. */
export const useProdBackendForDev: boolean = JSON.parse(
  process.env.NEXT_PUBLIC_USE_PROD_BACKEND_FOR_DEV as string
);

/** Switch to false to use development Firebase instance. */
export const useProdDb: boolean = JSON.parse(process.env.NEXT_PUBLIC_USE_PROD_DB as string);

/** Switch to false to test IDOL as a non-admin user. */
export const allowAdmin: boolean = JSON.parse(process.env.NEXT_PUBLIC_ALLOW_ADMIN as string);

export const backendURL =
  isProduction || !useProdBackendForDev
    ? '/.netlify/functions/api'
    : 'http://idol.cornelldti.org/.netlify/functions/api';
