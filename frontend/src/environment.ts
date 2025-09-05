export const isProduction = process.env.NODE_ENV === 'production';

export const environment: string | undefined = process.env.NEXT_PUBLIC_ENV;

/** Switch to true when using prod API for dev. */
export const useProdBackendForDev: boolean = process.env.NEXT_PUBLIC_USE_PROD_BACKEND_FOR_DEV
  ? JSON.parse(process.env.NEXT_PUBLIC_USE_PROD_BACKEND_FOR_DEV as string)
  : false;

/** Switch to false to use development Firebase instance. */
// only a local thing now
export const useProdDb: boolean = process.env.NEXT_PUBLIC_USE_PROD_DB
  ? JSON.parse(process.env.NEXT_PUBLIC_USE_PROD_DB as string)
  : true;

// only a local thing now
/** Switch to false to test IDOL as a non-admin user. */
export const allowAdmin: boolean = process.env.NEXT_PUBLIC_ALLOW_ADMIN
  ? JSON.parse(process.env.NEXT_PUBLIC_ALLOW_ADMIN as string)
  : true;

/** Switch to true to test IDOL as an applicant user. */
export const allowApplicant: boolean = process.env.NEXT_PUBLIC_IS_APPLICANT
  ? JSON.parse(process.env.NEXT_PUBLIC_IS_APPLICANT as string)
  : false;

export const backendURL =
  isProduction || !useProdBackendForDev
    ? '/.netlify/functions/api'
    : 'http://idol.cornelldti.org/.netlify/functions/api';

export const googleAPIKey =
  environment === 'prod'
    ? 'AIzaSyCCT5j588crPFvtKW5jM7Zkb_DLU_61VdY'
    : 'AIzaSyAIaEs6YX6HLbsvCJ_P6A3tO9s2rlFBV-s';

export const googleClientId =
  environment === 'prod'
    ? '223626581097-th7rt4a3ctqvndkhiuostib3998cgmh8.apps.googleusercontent.com'
    : '942472815572-olvg3mt3e5n4dtp98rkojpukpf0gj5o0.apps.googleusercontent.com';
