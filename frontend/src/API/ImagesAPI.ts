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

  public static uploadImage(body: Blob, name: string): Promise<void> {
    return this.getSignedURL(name).then((url) => {
      const headers = { 'content-type': body.type };
      return APIWrapper.put(url, body, headers).then(() => undefined);
    });
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
