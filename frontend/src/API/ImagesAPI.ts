import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
// import Emitters from '../EventEmitter/constant-emitters';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

// TODO: add typing and stuff to this file
export class ImagesAPI {
  public static getMemberImage(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/getMemberImage`, {
      withCredentials: true
    }).then((res) => res.data);

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder;
      }
      return val.url;
    });
  }

  private static getSignedURL(): Promise<any> {
    const responseProm = APIWrapper.get(`${backendURL}/getImageSignedURL`, {
      withCredentials: true
    }).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        // TODO: handle error with uploading image
      }
      return val.url;
    });
  }

  public static uploadMemberImage(body: any): Promise<any> {
    // TODO
    return this.getSignedURL().then((url) => {
      console.log(url);
      console.log(body);
      const responseProm = APIWrapper.put(url, body).then((res) => {
        console.log(res.data);
        return res.data;
      });
    });
  }
}
