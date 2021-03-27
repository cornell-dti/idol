import axios, { AxiosRequestConfig } from 'axios';
import { auth } from '../firebase';

export default class APIWrapper {
  public static post(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig | undefined
  ): Promise<any> {
    const responseProm = axios
      .post(url, body, {
        ...config,
        withCredentials: true
      })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
    return responseProm;
  }

  public static get(
    url: string,
    config?: AxiosRequestConfig | undefined
  ): Promise<any> {
    const responseProm = axios
      .get(url, {
        ...config,
        withCredentials: true
      })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
    return responseProm;
  }

  public static delete(
    url: string,
    config?: AxiosRequestConfig | undefined
  ): Promise<any> {
    const responseProm = axios
      .delete(url, {
        ...config,
        withCredentials: true
      })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
    return responseProm;
  }

  public static put(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig | undefined
  ): Promise<any> {
    const responseProm = axios
      .put(url, body, { ...config })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr));
    return responseProm;
  }

  private static responseMiddleware(resOrErr: any) {
    if (resOrErr.name === 'Error' && resOrErr.response.status === 440) {
      auth.signOut();
      return { data: { error: 'Session expired! Log in again!' } };
    }
    // No default, return the response
    if (resOrErr.name === 'Error') return resOrErr.response;
    return resOrErr;
  }
}
