const isProduction = true;
const useProdBackend = true;

export const environment = {
  isProduction: isProduction,
  useProdBackend: useProdBackend,
  backendURL: isProduction ?
    "https://idol.api.cornelldti.org/.netlify/functions/api/"
    : "http://localhost:9000/.netlify/functions/api/"
}