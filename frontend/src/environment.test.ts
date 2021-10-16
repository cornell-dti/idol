import { useProdDb, useProdBackendForDev } from './environment';

test('useProdDb check', () => expect(useProdDb).toEqual(true));

test('useProdBackendForDev', () => expect(useProdBackendForDev).toEqual(false));
