import { useProdBackendForDev } from './environment';

test('useProdBackendForDev', () => expect(useProdBackendForDev).toEqual(false));
