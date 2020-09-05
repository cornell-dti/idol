import { environment } from "../environment";
import axios from 'axios';

export type LoginResponse = {
  isLoggedIn: boolean
};

export type LogoutResponse = {
  isLoggedIn: boolean
};

export class LoginAPI {

  public static login(authToken: string): Promise<LoginResponse> {
    let responseProm = axios.post(environment.backendURL + 'login',
      { auth_token: authToken },
      {
        withCredentials: true
      })
      .then(async (res) => await res.data as LoginResponse);
    return responseProm;
  }

  public static logout(): Promise<LogoutResponse> {
    let responseProm = axios.post(environment.backendURL + 'logout', {}, {
      withCredentials: true
    })
      .then(async (res) => await res.data as LogoutResponse);
    return responseProm;
  }

}