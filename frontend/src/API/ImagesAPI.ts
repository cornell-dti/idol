import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

export default class ImagesAPI {
  public static getMemberImage(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/getMemberImage`).then((res) => res.data);

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder.src;
      }
      return val.url;
    });
  }

  private static getSignedURL(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/getImageSignedURL`).then((res) => res.data);
    return responseProm.then((val) => val.url);
  }

  public static uploadMemberImage(body: Blob): Promise<void> {
    return this.getSignedURL().then((url) => {
      const headers = { "contentType": 'image/jpeg' }
      APIWrapper.put(url, body, headers).then((res) => res.data);
    });
  }

  public static getEventProofImage(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/getEventProofImage`).then((res) => res.data);
    return responseProm.then((val) => val.url);
  }

  private static getEventProofImageSignedURL(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/getEventProofImageSignedURL`).then(
      (res) => res.data
    );
    return responseProm.then((val) => val.url);
  }

  public static uploadEventProofImage(body: Blob): Promise<void> {
    return this.getEventProofImageSignedURL().then((url) => {
      const headers = { "contentType": 'image/jpeg'}
      APIWrapper.put(url, body, headers).then((res) => res.data);
    });
  }
}
