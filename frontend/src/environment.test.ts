import { isStaging, useProdDb, useProdBackendForDev, allowAdmin } from './environment';

test('useProdDb check', () => expect(useProdDb || isStaging).toEqual(true));

test('useProdBackendForDev', () => expect(useProdBackendForDev).toEqual(false));

test('allowAdmin', () => expect(allowAdmin).toBe(true));
