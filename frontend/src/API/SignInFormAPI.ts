import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import Emitters from '../EventEmitter/constant-emitters';

type SignInCheckRequest = {
  id: string;
};

type SignInCheckResponse = {
  exists: boolean;
};

type SignInSubmitRequest = {
  id: string;
};

type SignInSubmitResponse = {
  success: boolean;
  id: string;
  error?: string;
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
}
