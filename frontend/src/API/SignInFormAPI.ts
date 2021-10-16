import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

type SignInFormResponseObj = {
  form: SignInFormObj;
  error?: string;
};

type SignInFormObj = { id: string; createdAt: number; expireAt: number };

export default class SignInFormAPI {
  public static checkFormExists(id: string): Promise<boolean> {
    return APIWrapper.post(`${backendURL}/signinExists`, {
      id
    }).then((res) => res.data.exists);
  }

  public static checkIfFormExpired(id: string): Promise<boolean> {
    return APIWrapper.post(`${backendURL}/signinExpired`, {
      id
    }).then((res) => res.data.expired);
  }

  public static submitSignIn(id: string): Promise<{ signedInAt: number; id: string }> {
    return APIWrapper.post(`${backendURL}/signin`, { id }).then((res) => res.data);
  }

  public static createSignInForm(id: string, expireAt: number): Promise<SignInFormResponseObj> {
    return APIWrapper.post(`${backendURL}/signinCreate`, {
      id,
      expireAt
    }).then((res) => res.data);
  }

  public static async deleteSignInForm(id: string): Promise<void> {
    await APIWrapper.post(`${backendURL}/signinDelete`, {
      id
    });
  }

  public static getAllSignInForms(): Promise<{
    readonly forms: readonly SignInForm[];
  }> {
    return APIWrapper.post(`${backendURL}/signinAll`, {}).then((res) => res.data);
  }
}
