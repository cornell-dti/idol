import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

type MemberResponseObj = {
  member: Member;
  error?: string;
};

export type Member = IdolMember;

export class MembersAPI {
  public static async getMembersFromAllSemesters(): Promise<Record<string, readonly IdolMember[]>> {
    return APIWrapper.get(`${backendURL}/member?type=all-semesters`).then((res) => res.data);
  }

  public static setMember(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/member`, member).then((res) => res.data);
  }

  public static deleteMember(memberEmail: string): Promise<{ status: number; error?: string }> {
    return APIWrapper.delete(`${backendURL}/member/${memberEmail}`).then((res) => res.data);
  }

  public static updateMember(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.put(`${backendURL}/member`, member).then((res) => res.data);
  }

  public static hasIDOLAccess(email: string): Promise<boolean> {
    return APIWrapper.get(`${backendURL}/hasIDOLAccess/${email}`).then(
      (res) => res.data.isIDOLMember
    );
  }

  public static getArchive(body: {
    [key: string]: string[];
  }): Promise<{ [key: string]: NovaMember[] }> {
    return APIWrapper.post(`${backendURL}/member-archive`, body).then((res) => res.data);
  }

  public static notifyMember(
    member: Member,
    endOfSemesterReminder: boolean
  ): Promise<MemberResponseObj> {
    return APIWrapper.post(
      `${backendURL}/team-event-reminder${
        endOfSemesterReminder ? '?end_of_semester_reminder=true' : ''
      }`,
      member
    ).then((res) => res.data);
  }
}
