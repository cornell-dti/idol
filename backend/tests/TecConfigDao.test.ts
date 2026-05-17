/// <reference types="common-types" />
import TecConfigDao from '../src/dao/TecConfigDao';
import { tecConfigCollection } from '../src/firebase';
import { DEFAULT_TEC_CONFIG } from '../src/consts';
import { BadRequestError, HandlerError } from '../src/utils/errors';

jest.setTimeout(20000);

const DOC_ID = 'current';

let originalDoc: FirebaseFirestore.DocumentData | undefined;

beforeAll(async () => {
  const snap = await tecConfigCollection.doc(DOC_ID).get();
  originalDoc = snap.exists ? snap.data() : undefined;
});

afterAll(async () => {
  if (originalDoc) {
    await tecConfigCollection.doc(DOC_ID).set(originalDoc as TECConfig);
  } else {
    await tecConfigCollection.doc(DOC_ID).delete();
  }
});

const validConfig: TECConfig = {
  periodEndDates: ['2026-02-22T23:59:59', '2026-03-19T23:59:59'],
  requiredMemberTecCredits: 1,
  requiredLeadTecCredits: 2
};

describe('TecConfigDao.getTecConfig', () => {
  test('returns the stored config when the doc exists and is valid', async () => {
    await tecConfigCollection.doc(DOC_ID).set(validConfig);

    const result = await TecConfigDao.getTecConfig();
    expect(result).toEqual(validConfig);
  });

  test('returns DEFAULT_TEC_CONFIG when the doc does not exist', async () => {
    await tecConfigCollection.doc(DOC_ID).delete();

    const result = await TecConfigDao.getTecConfig();
    expect(result).toEqual(DEFAULT_TEC_CONFIG);
  });

  test('throws when the stored doc is malformed', async () => {
    await tecConfigCollection.doc(DOC_ID).set({
      periodEndDates: ['2026-02-22T23:59:59'],
      requiredMemberTecCredits: 'not a number'
    } as unknown as TECConfig);

    await expect(TecConfigDao.getTecConfig()).rejects.toThrow(HandlerError);
  });
});

describe('TecConfigDao.updateTecConfig', () => {
  test('writes the config and returns it (round-trips through Firestore)', async () => {
    const returned = await TecConfigDao.updateTecConfig(validConfig);
    expect(returned.requiredMemberTecCredits).toBe(validConfig.requiredMemberTecCredits);
    expect(returned.requiredLeadTecCredits).toBe(validConfig.requiredLeadTecCredits);

    const fetched = await TecConfigDao.getTecConfig();
    expect(fetched).toEqual(returned);
  });

  test('sorts periodEndDates chronologically before persisting', async () => {
    const unsorted: TECConfig = {
      periodEndDates: ['2026-05-04T23:59:59', '2026-02-22T23:59:59', '2026-03-19T23:59:59'],
      requiredMemberTecCredits: 1,
      requiredLeadTecCredits: 2
    };

    const result = await TecConfigDao.updateTecConfig(unsorted);
    expect(result.periodEndDates).toEqual([
      '2026-02-22T23:59:59',
      '2026-03-19T23:59:59',
      '2026-05-04T23:59:59'
    ]);
  });

  describe('validation', () => {
    test('throws BadRequestError when periodEndDates is empty', async () => {
      await expect(
        TecConfigDao.updateTecConfig({
          periodEndDates: [],
          requiredMemberTecCredits: 1,
          requiredLeadTecCredits: 2
        })
      ).rejects.toThrow(BadRequestError);
    });

    test('throws BadRequestError when a periodEndDate is not parseable', async () => {
      await expect(
        TecConfigDao.updateTecConfig({
          periodEndDates: ['not a date'],
          requiredMemberTecCredits: 1,
          requiredLeadTecCredits: 2
        })
      ).rejects.toThrow(BadRequestError);
    });

    test('throws BadRequestError when periodEndDates contains a non-string', async () => {
      await expect(
        TecConfigDao.updateTecConfig({
          periodEndDates: [123 as unknown as string],
          requiredMemberTecCredits: 1,
          requiredLeadTecCredits: 2
        })
      ).rejects.toThrow(BadRequestError);
    });

    test('throws BadRequestError when a required credit field is missing', async () => {
      const missing = {
        periodEndDates: ['2026-02-22T23:59:59'],
        requiredMemberTecCredits: 1
      } as unknown as TECConfig;

      await expect(TecConfigDao.updateTecConfig(missing)).rejects.toThrow(BadRequestError);
    });

    test('throws BadRequestError when required credits are negative', async () => {
      await expect(
        TecConfigDao.updateTecConfig({
          periodEndDates: ['2026-02-22T23:59:59'],
          requiredMemberTecCredits: -1,
          requiredLeadTecCredits: 2
        })
      ).rejects.toThrow(BadRequestError);
    });
  });
});
