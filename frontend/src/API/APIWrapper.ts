import axios, { AxiosRequestConfig } from 'axios';
import { auth } from '../firebase';

export default class APIWrapper {
  public static post(
    url: string,
    body: any,
    config?: AxiosRequestConfig | undefined,
    errDefault?: any
  ): Promise<any> {
    const responseProm = axios
      .post(url, body, {
        ...config,
        withCredentials: true
      })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr, errDefault));
    return responseProm;
  }

  public static get(
    url: string,
    config?: AxiosRequestConfig | undefined,
    errDefault?: any
  ): Promise<any> {
    const responseProm = axios
      .get(url, {
        ...config,
        withCredentials: true
      })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr, errDefault));
    return responseProm;
  }

  public static delete(
    url: string,
    config?: AxiosRequestConfig | undefined,
    errDefault?: any
  ): Promise<any> {
    const responseProm = axios
      .delete(url, {
        ...config,
        withCredentials: true
      })
      .catch((err) => err)
      .then((resOrErr) => this.responseMiddleware(resOrErr, errDefault));
    return responseProm;
  }

  public static put(
    url: string,
    body: any,
    config?: AxiosRequestConfig | undefined,
    errDefault?: any
  ): Promise<any> {
    const responseProm = axios
      .put(url, body, {
        ...config
      })
      .catch((err) => err)
      .then((resOrErr) => resOrErr);
    return responseProm;
  }

  private static responseMiddleware(resOrErr: any, errDefault?: any) {
    console.log(resOrErr.response, resOrErr);
    if (resOrErr.name === 'Error' && resOrErr.response.status === 440) {
      auth.signOut();
      return (
        errDefault || { data: { error: 'Session expired! Log in again!' } }
      );
    }
    if (resOrErr.name === 'Error' && errDefault) {
      // It's an error, return the default value
      return errDefault;
    }
    if (resOrErr.name === 'Error' && !errDefault) {
      // No default, return the response
      return resOrErr.response;
    }
    return resOrErr;
  }
}
