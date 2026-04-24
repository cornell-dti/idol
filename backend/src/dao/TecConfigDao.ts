import { tecConfigCollection } from '../firebase';
import { DEFAULT_TEC_CONFIG } from '../consts';
import { BadRequestError } from '../utils/errors';


const TEC_CONFIG_DOC_ID = 'current';

export default class TecConfigDao {
  /** Returns the saved TEC config from Firestore document, or DEFAULT_TEC_CONFIG if invalid for some reason. */
  static async getTecConfig(): Promise<TECConfig> {
    const snap = await tecConfigCollection.doc(TEC_CONFIG_DOC_ID).get();
    if (!snap.exists) {
      return DEFAULT_TEC_CONFIG;
    }
    const data = snap.data();
    if (!isValidTecConfig(data)) {
      return DEFAULT_TEC_CONFIG;
    }
    return data;
  }

  static async updateTecConfig(config: TECConfig): Promise<TECConfig> {
    if (!isValidTecConfig(config)) {
      throw new BadRequestError("Invalid TEC config");
    }

    const normalizedConfig: TECConfig = {
      periodEndDates: [...config.periodEndDates].sort(), // assures chronological order
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
    data.periodEndDates.every((d) => typeof d === 'string') &&
    typeof data.requiredMemberTecCredits === 'number' &&
    typeof data.requiredLeadTecCredits === 'number'
  );
}