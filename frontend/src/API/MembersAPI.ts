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

  public static setMember(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/setMember`, member).then((res) => res.data);
  }

  public static deleteMember(memberEmail: string): Promise<{ status: number; error?: string }> {
    return APIWrapper.delete(`${backendURL}/deleteMember/${memberEmail}`).then((res) => res.data);
  }

  public static updateMember(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/updateMember`, member).then((res) => res.data);
  }

  public static hasIDOLAccess(email: string): Promise<boolean> {
    return APIWrapper.get(`${backendURL}/hasIDOLAccess/${email}`).then(
      (res) => res.data.isIDOLMember
    );
  }
}
