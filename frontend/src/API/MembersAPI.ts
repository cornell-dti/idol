import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

type MemberResponseObj = {
  member: Member;
  error?: string;
};

export type Member = IdolMember;

export class MembersAPI {
  public static getAllMembers(): Promise<IdolMember[]> {
    const res = APIWrapper.get(`${backendURL}/member`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all members",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const members = val.members as IdolMember[];
      return members;
    });
  }

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

  public static hasIDOLAccess(email: string, type?: string): Promise<boolean> {
    return APIWrapper.get(`${backendURL}/hasIDOLAccess/${email}?type=${type}`).then(
      (res) => res.data.hasIDOLAccess
    );
  }

  public static getArchive(body: {
    [key: string]: string[];
  }): Promise<{ [key: string]: IdolMember[] }> {
    return APIWrapper.post(`${backendURL}/member-archive`, body).then((res) => res.data);
  }

  public static notifyMemberTeamEvents(
    member: Member,
    endOfPeriodReminder: boolean
  ): Promise<MemberResponseObj> {
    return APIWrapper.post(
      `${backendURL}/team-event-reminder${
        endOfPeriodReminder ? '?end_of_period_reminder=true' : ''
      }`,
      member
    ).then((res) => res.data);
  }

  public static notifyMemberPeriod(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/send-period-reminder`, member).then((res) => res.data);
  }

  public static notifyMemberCoffeeChat(member: Member): Promise<MemberResponseObj> {
    return APIWrapper.post(`${backendURL}/coffee-chat-reminder`, member).then((res) => res.data);
  }
}
