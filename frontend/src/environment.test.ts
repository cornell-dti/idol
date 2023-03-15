import { useProdBackendForDev, allowAdmin } from './environment';

test('useProdBackendForDev', () => expect(useProdBackendForDev).toEqual(false));

test('allowAdmin', () => expect(allowAdmin).toBe(true));
