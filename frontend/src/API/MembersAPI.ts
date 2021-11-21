import { APICache, Emitters } from '../utils';
import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

type MemberResponseObj = {
  member: Member;
  error?: string;
};

export type Member = IdolMember;

export class MembersAPI {
  public static async getMembersFromAllSemesters(): Promise<Record<string, readonly IdolMember[]>> {
    return APIWrapper.get(`${backendURL}/membersFromAllSemesters`).then((res) => res.data);
  }

  public static getMember(email: string): Promise<Member> {
    const funcName = `member/${email}`;
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    const responseProm = APIWrapper.get(`${backendURL}/getMember/${email}`).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get member!",
          contentMsg: `Error was: ${val.error}`
        });
      }
      const mem = val.member as Member;
      APICache.cache(funcName, mem);
      return mem;
    });
  }

  public static setMember(member: Member): Promise<MemberResponseObj> {
    APICache.invalidate(`members/${member.email}`);
    return APIWrapper.post(`${backendURL}/setMember`, member).then((res) => res.data);
  }

  public static deleteMember(memberEmail: string): Promise<{ status: number; error?: string }> {
    APICache.invalidate(`members/${memberEmail}`);
    return APIWrapper.delete(`${backendURL}/deleteMember/${memberEmail}`).then((res) => res.data);
  }

  public static updateMember(member: Member): Promise<MemberResponseObj> {
    APICache.invalidate(`members/${member.email}`);
    return APIWrapper.post(`${backendURL}/updateMember`, member).then((res) => res.data);
  }
}
