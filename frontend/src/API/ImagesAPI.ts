import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import Emitters from '../EventEmitter/constant-emitters';
import HeadshotPlaceholder from '../static/images/headshot-placeholder.png';

// TODO: add typing and stuff to this file
export class ImagesAPI {
  public static getMemberImage(): Promise<string> {
    console.log('getMemberImage()');
    const responseProm = APIWrapper.get(`${backendURL}/getMemberImage`, {
      withCredentials: true
    }).then((res) => res.data);

    return responseProm.then((val) => {
      if (val.error) {
        return HeadshotPlaceholder;
      }
      const { url } = val;
      return url;
    });
  }
}
