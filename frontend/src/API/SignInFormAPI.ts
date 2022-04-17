import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

type SignInFormResponseObj = {
  form: SignInFormObj;
  error?: string;
};

type SignInFormObj = { id: string; createdAt: number; expireAt: number };

export default class SignInFormAPI {
  public static checkFormExists(id: string): Promise<boolean> {
    return APIWrapper.post(`${backendURL}/signInExists`, {
      id
    }).then((res) => res.data.exists);
  }

  public static checkIfFormExpired(id: string): Promise<boolean> {
    return APIWrapper.post(`${backendURL}/signInExpired`, {
      id
    }).then((res) => res.data.expired);
  }

  public static submitSignIn(id: string): Promise<{ signedInAt: number; id: string }> {
    return APIWrapper.post(`${backendURL}/signIn`, { id }).then((res) => res.data);
  }

  public static createSignInForm(id: string, expireAt: number): Promise<SignInFormResponseObj> {
    return APIWrapper.post(`${backendURL}/signInCreate`, {
      id,
      expireAt
    }).then((res) => res.data);
  }

  public static async deleteSignInForm(id: string): Promise<void> {
    await APIWrapper.post(`${backendURL}/signInDelete`, {
      id
    });
  }

  public static getAllSignInForms(): Promise<{
    readonly forms: readonly SignInForm[];
  }> {
    return APIWrapper.post(`${backendURL}/signInAll`, {}).then((res) => res.data);
  }
}
