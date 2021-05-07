import axios, { AxiosError, AxiosResponse } from 'axios';
import { auth } from '../firebase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type APIProcessedResponse = { data: any };

export default class APIWrapper {
  public static post(
    url: string,
    body: unknown
  ): Promise<APIProcessedResponse> {
    return axios
      .post(url, body, { withCredentials: true })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  public static get(url: string): Promise<APIProcessedResponse> {
    return axios
      .get(url, { withCredentials: true })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => {
        console.log(resOrErr);
        return this.responseMiddleware(resOrErr);
      });
  }

  public static delete(url: string): Promise<APIProcessedResponse> {
    return axios
      .delete(url, { withCredentials: true })
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  public static put(url: string, body: unknown): Promise<APIProcessedResponse> {
    return axios
      .put(url, body, {})
      .catch((err: AxiosError) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
  }

  private static responseMiddleware(
    resOrErr: AxiosResponse | AxiosError
  ): APIProcessedResponse {
    if (resOrErr instanceof Error && resOrErr.response?.status === 440) {
      console.log(resOrErr);
      auth.signOut();
      return { data: { error: 'Session expired! Log in again!' } };
    }
    // No default, return the response
    if (resOrErr instanceof Error) return resOrErr.response ?? { data: null };
    return resOrErr;
  }
}
