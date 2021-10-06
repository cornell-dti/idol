import { useProdDb } from './environment';

test('Config test', () => expect(useProdDb).toEqual(true));
