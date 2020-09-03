import { firestore } from "../firebase";
import { APICache } from "../Cache/Cache";

export type Member = {
  email: string,
  first_name: string,
  last_name: string,
  role: string
}

export class MembersAPI {

  public static getAllMembers(): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    let funcName = this.name;
    return APICache.has(funcName) ?
      Promise.resolve(APICache.retrieve(funcName))
      :
      firestore.collection('members').get().then((val) => {
        APICache.cache(funcName, val);
        return val;
      });
  }

}