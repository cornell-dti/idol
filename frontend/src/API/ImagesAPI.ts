import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

export default class ImagesAPI {
  public static getImage(name: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/image/${name}`).then((res) => res.data);

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder.src;
      }
      return val.url;
    });
  }

  private static getSignedURL(name: string): Promise<string> {
    const responseProm = APIWrapper.get(`${backendURL}/image-signed-url/${name}`).then(
      (res) => res.data
    );
    return responseProm.then((val) => val.url);
  }

  public static async uploadImage(
    body: Blob,
    name: string,
    options?: { throwOnError: boolean }
  ): Promise<void> {
    const url = await this.getSignedURL(name);
    if (options?.throwOnError && !url) throw new Error('Could not get an image upload URL.');
    const headers = { 'content-type': body.type };
    const { data, status } = await APIWrapper.put(url, body, headers);
    if (options?.throwOnError && (data == null || data.error || (status ?? 0) >= 400)) {
      throw new Error(data?.error || 'Could not upload image.');
    }
  }

  public static async deleteImage(
    name: string,
    options?: { throwOnError: boolean }
  ): Promise<void> {
    const { data, status } = await APIWrapper.delete(`${backendURL}/image/${name}`);
    if (options?.throwOnError && (data == null || data.error || (status ?? 0) >= 400)) {
      throw new Error(data?.error || 'Could not delete image.');
    }
  }
}
