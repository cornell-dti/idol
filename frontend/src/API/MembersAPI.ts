/* eslint-disable no-await-in-loop */
import { backendURL } from '../environment';
import { delay, Emitters } from '../utils';
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

  public static hasIDOLAccess(email: string): Promise<boolean> {
    return APIWrapper.get(`${backendURL}/hasIDOLAccess/${email}`).then(
      (res) => res.data.isIDOLMember
    );
  }

  public static getArchive(body: {
    [key: string]: string[];
  }): Promise<{ [key: string]: IdolMember[] }> {
    return APIWrapper.post(`${backendURL}/member-archive`, body).then((res) => res.data);
  }

  public static async notifyMemberTeamEvents(
    members: Member[],
    endOfSemesterReminder: boolean
  ): Promise<void> {
    let numMember = 0;
    for (const member of members) {
      await APIWrapper.post(
        `${backendURL}/team-event-reminder${
          endOfSemesterReminder ? '?end_of_semester_reminder=true' : ''
        }`,
        member
      ).then((res) => res.data);
      if (numMember === members.length - 1) return;
      numMember += 1;
      await delay(1000);
    }
  }

  public static async notifyMemberCoffeeChat(members: Member[]): Promise<void> {
    let numMember = 0;
    for (const member of members) {
      await APIWrapper.post(`${backendURL}/coffee-chat-reminder`, member).then((res) => res.data);
      if (numMember === members.length - 1) return;
      numMember += 1;
      await delay(1000);
    }
  }
}
