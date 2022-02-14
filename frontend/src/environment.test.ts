import { useProdDb, useProdBackendForDev, allowAdmin } from './environment';

test('useProdDb check', () => expect(useProdDb).toEqual(true));

test('useProdBackendForDev', () => expect(useProdBackendForDev).toEqual(false));

test('allowAdmin', () => expect(allowAdmin).toBe(true));
