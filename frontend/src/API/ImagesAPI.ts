import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

export default class ImagesAPI {
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

  private static getSignedURL(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/getImageSignedURL`, {
      withCredentials: true
    }).then((res) => res.data);
    return responseProm.then((val) => val.url);
  }

  public static uploadMemberImage(body: Blob): Promise<void> {
    return this.getSignedURL().then((url) => {
      APIWrapper.put(url, body).then((res) => res.data);
    });
  }
}
