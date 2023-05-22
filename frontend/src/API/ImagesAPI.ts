import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

export default class ImagesAPI {
  // member images
  public static getMemberImage(email: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/memberImage/${email}`).then(
      (res) => res.data
    );

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder.src;
      }
      return val.url;
    });
  }

  private static getSignedURL(email: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/memberImage/${email}/signed-url`).then(
      (res) => res.data
    );
    return responseProm.then((val) => val.url);
  }

  public static uploadMemberImage(body: Blob, email: string): Promise<void> {
    return this.getSignedURL(email).then((url) => {
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
    const responseProm = APIWrapper.get(`${backendURL}/event-proof-image/${name}/signed-url`).then(
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
    await APIWrapper.post(`${backendURL}/event-proof-image/${name}`, { name });
  }
}
