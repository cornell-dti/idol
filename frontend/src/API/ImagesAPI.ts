import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

export default class ImagesAPI {
  // member images
  public static getMemberImage(email: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/member-image/${email}`).then(
      (res) => res.data
    );

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder.src;
      }
      return val.url;
    });
  }

  private static getSignedURL(): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/member-image-signedURL`).then(
      (res) => res.data
    );
    return responseProm.then((val) => val.url);
  }

  public static uploadMemberImage(body: Blob): Promise<void> {
    return this.getSignedURL().then((url) => {
      const headers = { 'content-type': 'image/jpeg' };
      APIWrapper.put(url, body, headers).then((res) => res.data);
    });
  }

  // Event proof images
  public static getEventProofImage(name: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/event-proof-image/${name}`).then(
      (res) => res.data
    );
    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder.src;
      }
      return val.url;
    });
  }

  private static getEventProofImageSignedURL(name: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/event-proof-image-signed-url/${name}`).then(
      (res) => res.data
    );
    return responseProm.then((val) => val.url);
  }

  public static uploadEventProofImage(body: Blob, name: string): Promise<void> {
    return this.getEventProofImageSignedURL(name).then((url) => {
      const headers = { 'content-type': 'image/jpeg' };
      APIWrapper.put(url, body, headers).then((res) => res.data);
    });
  }

  public static async deleteEventProofImage(name: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/event-proof-image/${name}`);
  }
}
