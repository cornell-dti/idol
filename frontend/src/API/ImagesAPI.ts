import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

export default class ImagesAPI {
  public static getImage(email: string, name: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/${name}/${email}`).then((res) => res.data);

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder.src;
      }
      return val.url;
    });
  }

  private static getSignedURL(name: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/${name}`).then((res) => res.data);
    return responseProm.then((val) => val.url);
  }

  public static uploadImage(body: Blob, name: string): Promise<void> {
    return this.getSignedURL(`${name}`).then((url) => {
      const headers = { 'content-type': 'image/jpeg' };
      APIWrapper.put(url, body, headers).then((res) => res.data);
    });
  }

  public static async deleteImage(name: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/${name}`);
  }
}
