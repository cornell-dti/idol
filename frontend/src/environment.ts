const isProduction = true;
const useProdBackend = true;

const environment = {
  isProduction,
  useProdBackend,
  // eslint-disable-next-line no-nested-ternary
  backendURL: isProduction
    ? 'https://idol.api.cornelldti.org/.netlify/functions/api/'
    : useProdBackend
    ? 'http://idol.api.cornelldti.org/.netlify/functions/api/'
    : 'http://localhost:9000/.netlify/functions/api/'
};

export default environment;
