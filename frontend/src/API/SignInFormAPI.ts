import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import Emitters from '../EventEmitter/constant-emitters';
import { SignInForm } from '../../../backend/src/DataTypes';

export type SignInCheckRequest = {
  id: string;
};

export type SignInCheckResponse = {
  exists: boolean;
};

export type SignInSubmitRequest = {
  id: string;
};

export type SignInSubmitResponse = {
  success: boolean;
  signedInAt: number;
  id: string;
  error?: string;
};

export type SignInCreateRequest = {
  id: string;
};

export type SignInCreateResponse = {
  success: boolean;
  createdAt?: number;
  id: string;
  error?: Record<string, unknown>;
};

export type SignInDeleteRequest = {
  id: string;
};

export type SignInDeleteResponse = {
  success: boolean;
  error?: Record<string, unknown>;
};

export type SignInAllResponse = {
  forms: SignInForm[];
};

export default class SignInFormAPI {
  public static checkFormExists(id: string): Promise<boolean> {
    const req: SignInCheckRequest = { id };
    const responseProm = APIWrapper.post(
      `${backendURL}/signinExists`,
      req
    ).then((res) => res.data);

    return responseProm.then((resp: SignInCheckResponse) => resp.exists);
  }

  public static submitSignIn(id: string): Promise<SignInSubmitResponse> {
    const req: SignInSubmitRequest = { id };
    const responseProm = APIWrapper.post(
      `${backendURL}/signin`,
      req
    ).then((res) => res.data);

    return responseProm.then((resp: SignInSubmitResponse) => {
      if (resp.error) {
        Emitters.generalError.emit({
          headerMsg: 'Could not submit sign in form!',
          contentMsg: resp.error
        });
      }
      return resp;
    });
  }

  public static createSignInForm(id: string): Promise<SignInCreateResponse> {
    const req: SignInCreateRequest = { id };
    const responseProm = APIWrapper.post(
      `${backendURL}/signinCreate`,
      req
    ).then((res) => res.data);

    return responseProm;
  }

  public static deleteSignInForm(id: string): Promise<SignInDeleteResponse> {
    const req: SignInDeleteRequest = { id };
    const responseProm = APIWrapper.post(
      `${backendURL}/signinDelete`,
      req
    ).then((res) => res.data);

    return responseProm;
  }

  public static getAllSignInForms(): Promise<SignInAllResponse> {
    const responseProm = APIWrapper.post(
      `${backendURL}/signinAll`,
      {}
    ).then((res) => res.data);

    return responseProm;
  }
}
