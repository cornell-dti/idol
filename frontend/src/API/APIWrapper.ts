import axios, { AxiosError, AxiosResponse } from 'axios';
import { auth } from '../firebase';
import { getUserIdToken } from '../components/Common/UserProvider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type APIProcessedResponse = { data: any };

export default class APIWrapper {
  public static async post(url: string, body: unknown): Promise<APIProcessedResponse> {
    const idToken = await getUserIdToken();
    return axios
      .post(url, body, { headers: { 'auth-token': idToken } })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  public static async get(url: string): Promise<APIProcessedResponse> {
    const idToken = await getUserIdToken();
    return axios
      .get(url, { headers: { 'auth-token': idToken } })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  public static async delete(url: string): Promise<APIProcessedResponse> {
    const idToken = await getUserIdToken();
    return axios
      .delete(url, { headers: { 'auth-token': idToken } })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  public static async put(url: string, body: unknown): Promise<APIProcessedResponse> {
    const idToken = await getUserIdToken();
    return axios
      .put(url, body, { headers: { 'auth-token': idToken } })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  private static responseMiddleware(resOrErr: AxiosResponse | AxiosError): APIProcessedResponse {
    if (resOrErr instanceof Error && resOrErr.response?.status === 440) {
      auth.signOut();
      return { data: { error: 'Session expired! Log in again!' } };
    }
    // No default, return the response
    if (resOrErr instanceof Error) return resOrErr.response ?? { data: null };
    return resOrErr;
  }
}
