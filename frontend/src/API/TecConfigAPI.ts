import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

/**
 * Frontend for the `/tec-config` backend endpoints.
 *
 * The TEC config (period end dates + credit requirements) lives in a single
 * Firestore document and is read by anywhere in the app that needs to bucket
 * team events into periods or compute required credits. Only
 * IDOL admins on the backend can make edits.
 */
export default class TecConfigAPI {
  /**
   * Fetches the current TEC config from the backend.
   *
   * Any IDOL member can call this. Backend returns the stored config,
   * or `DEFAULT_TEC_CONFIG` if no document has been created yet. A malformed
   * stored doc throws a 500 error.
   */
  static async getTecConfig(): Promise<TECConfig> {
    const response = await APIWrapper.get(`${backendURL}/tec-config`);
    return response.data.config;
  }

  /**
   * Writes a new TEC config to the backend, admin-only.
   *
   * Throws if the request fails or permission denied, validation error, etc. Callers
   * should catch this via `Emitters.generalError`.
   *
   * @param config The full TEC config to persist.
   * @returns The normalized config that was written (period end dates sorted).
   */
  static async updateTecConfig(config: TECConfig): Promise<TECConfig> {
    const response = await APIWrapper.put(`${backendURL}/tec-config`, config);
    if (!response.data?.config) {
      throw new Error(response.data?.error ?? 'Failed to update TEC Periods');
    }
    return response.data.config;
  }
}
