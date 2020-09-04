import { environment } from "../environment";

export type LoginResponse = {
  isLoggedIn: boolean
};

export type LogoutResponse = {
  isLoggedIn: boolean
};

export class LoginAPI {

  public static login(authToken: string): Promise<LoginResponse> {
    let responseProm = fetch(environment.backendURL + 'login', {
      credentials: "include", method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ auth_token: authToken })
    })
      .then(async (res) => await res.json() as LoginResponse);
    return responseProm;
  }

  public static logout(): Promise<LogoutResponse> {
    let responseProm = fetch(environment.backendURL + 'logout', { credentials: "include" })
      .then(async (res) => await res.json() as LogoutResponse);
    return responseProm;
  }

}