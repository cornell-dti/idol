import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export type LoginResponse = {
  isLoggedIn: boolean;
};

export type LogoutResponse = {
  isLoggedIn: boolean;
};

export class LoginAPI {
  public static login(authToken: string): Promise<LoginResponse> {
    const responseProm = APIWrapper.post(
      `${backendURL}/login`,
      { auth_token: authToken },
      {
        withCredentials: true
      }
    ).then((res) => res.data as LoginResponse);
    return responseProm;
  }

  public static logout(): Promise<LogoutResponse> {
    const responseProm = APIWrapper.post(
      `${backendURL}/logout`,
      {},
      {
        withCredentials: true
      }
    ).then((res) => res.data as LogoutResponse);
    return responseProm;
  }
}
