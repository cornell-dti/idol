import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

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
    return responseProm.then((val) => val.url);
  }

  public static uploadMemberImage(body: any): Promise<any> {
    return this.getSignedURL().then((url) => {
      const responseProm = APIWrapper.put(url, body).then((res) => {
        console.log(res.data);
        return res.data;
      });
    });
  }
}
