import { tecConfigCollection } from '../firebase';
import { DEFAULT_TEC_CONFIG } from '../consts';
import { BadRequestError, HandlerError } from '../utils/errors';

const TEC_CONFIG_DOC_ID = 'current';

export default class TecConfigDao {
  /**
   * Returns the saved TEC config from the Firestore document.
   *
   * If the document does not exist, returns `DEFAULT_TEC_CONFIG`
   * and logs a warning.
   *
   * If the document exists but is malformed, throws a 500 error.
   */
  static async getTecConfig(): Promise<TECConfig> {
    const snap = await tecConfigCollection.doc(TEC_CONFIG_DOC_ID).get();
    if (!snap.exists) {
      // eslint-disable-next-line no-console
      console.warn(
        `[TecConfigDao] No TEC config document found at tec-config/${TEC_CONFIG_DOC_ID}; ` +
          `falling back to DEFAULT_TEC_CONFIG. Seed the document via the admin panel.`
      );
      return DEFAULT_TEC_CONFIG;
    }
    const data = snap.data();
    if (!isValidTecConfig(data)) {
      // eslint-disable-next-line no-console
      console.error(
        `[TecConfigDao] Malformed TEC config at tec-config/${TEC_CONFIG_DOC_ID}:`,
        data
      );
      throw new HandlerError(
        500,
        `Stored TEC config at tec-config/${TEC_CONFIG_DOC_ID} is malformed. ` +
          `An admin must re-save the config via the admin panel.`
      );
    }
    return data;
  }

  /**
   * Validates and persists a TEC config to the Firestore document.
   *
   * Validation checks that `periodEndDates` is a
   * non-empty array of parseable date strings and that both credit
   * requirements are non-negative numbers. Period end dates are sorted
   * chronologically.
   *
   * @param config The full TEC config to persist.
   * @returns The normalized config that was written (dates sorted).
   * @throws {BadRequestError} If `config` fails validation.
   */
  static async updateTecConfig(config: TECConfig): Promise<TECConfig> {
    if (!isValidTecConfig(config)) {
      throw new BadRequestError('Invalid TEC config');
    }

    const normalizedConfig: TECConfig = {
      periodEndDates: [...config.periodEndDates].sort(), // ensures chronological order
      requiredMemberTecCredits: config.requiredMemberTecCredits,
      requiredLeadTecCredits: config.requiredLeadTecCredits
    };

    await tecConfigCollection.doc(TEC_CONFIG_DOC_ID).set(normalizedConfig);
    return normalizedConfig;
  }
}

function isValidTecConfig(data: TECConfig | undefined): data is TECConfig {
  if (!data) return false;
  return (
    Array.isArray(data.periodEndDates) &&
    data.periodEndDates.length > 0 &&
    data.periodEndDates.every((d) => typeof d === 'string' && !Number.isNaN(Date.parse(d))) &&
    typeof data.requiredMemberTecCredits === 'number' &&
    typeof data.requiredLeadTecCredits === 'number' &&
    data.requiredMemberTecCredits >= 0 &&
    data.requiredLeadTecCredits >= 0
  );
}
