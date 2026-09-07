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
    const normalized = normalizeTecConfig(snap.data());
    if (!normalized) {
      // eslint-disable-next-line no-console
      console.error(
        `[TecConfigDao] Malformed TEC config at tec-config/${TEC_CONFIG_DOC_ID}:`,
        snap.data()
      );
      throw new HandlerError(
        500,
        `Stored TEC config at tec-config/${TEC_CONFIG_DOC_ID} is malformed. ` +
          `An admin must re-save the config via the admin panel.`
      );
    }
    return normalized;
  }

  /**
   * Validates and persists a TEC config to the Firestore document.
   *
   * Validation checks that `periodEndDates` is a
   * non-empty array of parseable date strings, that credit
   * requirements are non-negative numbers, and that `considerEventKind`
   * is a boolean. Period end dates are sorted
   * chronologically. Missing internal/external credit fields fall back
   * to `DEFAULT_TEC_CONFIG`.
   *
   * @param config The full TEC config to persist.
   * @returns The normalized config that was written (dates sorted).
   * @throws {BadRequestError} If `config` fails validation.
   */
  static async updateTecConfig(config: TECConfig): Promise<TECConfig> {
    const normalizedConfig = normalizeTecConfig(config);
    if (!normalizedConfig) {
      throw new BadRequestError('Invalid TEC config');
    }

    await tecConfigCollection.doc(TEC_CONFIG_DOC_ID).set(normalizedConfig);
    return normalizedConfig;
  }
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && value >= 0;
}

function kindCreditOrDefault(value: unknown, fallback: number): number | undefined {
  if (value === undefined) return fallback;
  if (isNonNegativeNumber(value)) return value;
  return undefined;
}

function normalizeTecConfig(data: TECConfig | undefined): TECConfig | null {
  if (!data) return null;
  if (
    !Array.isArray(data.periodEndDates) ||
    data.periodEndDates.length === 0 ||
    !data.periodEndDates.every((d) => typeof d === 'string' && !Number.isNaN(Date.parse(d))) ||
    !isNonNegativeNumber(data.requiredMemberTecCredits) ||
    !isNonNegativeNumber(data.requiredLeadTecCredits) ||
    typeof data.considerEventKind !== 'boolean'
  ) {
    return null;
  }

  const requiredMemberInternalTecCredits = kindCreditOrDefault(
    data.requiredMemberInternalTecCredits,
    DEFAULT_TEC_CONFIG.requiredMemberInternalTecCredits
  );
  const requiredMemberExternalTecCredits = kindCreditOrDefault(
    data.requiredMemberExternalTecCredits,
    DEFAULT_TEC_CONFIG.requiredMemberExternalTecCredits
  );
  const requiredLeadInternalTecCredits = kindCreditOrDefault(
    data.requiredLeadInternalTecCredits,
    DEFAULT_TEC_CONFIG.requiredLeadInternalTecCredits
  );
  const requiredLeadExternalTecCredits = kindCreditOrDefault(
    data.requiredLeadExternalTecCredits,
    DEFAULT_TEC_CONFIG.requiredLeadExternalTecCredits
  );

  if (
    requiredMemberInternalTecCredits === undefined ||
    requiredMemberExternalTecCredits === undefined ||
    requiredLeadInternalTecCredits === undefined ||
    requiredLeadExternalTecCredits === undefined
  ) {
    return null;
  }

  return {
    periodEndDates: [...data.periodEndDates].sort(),
    requiredMemberTecCredits: data.requiredMemberTecCredits,
    requiredLeadTecCredits: data.requiredLeadTecCredits,
    considerEventKind: data.considerEventKind,
    requiredMemberInternalTecCredits,
    requiredMemberExternalTecCredits,
    requiredLeadInternalTecCredits,
    requiredLeadExternalTecCredits
  };
}
