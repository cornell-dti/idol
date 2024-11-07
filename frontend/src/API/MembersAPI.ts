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

  public static hasIDOLAccess(email: string): Promise<boolean> {
    return APIWrapper.get(`${backendURL}/hasIDOLAccess/${email}`).then(
      (res) => res.data.isIDOLMember
    );
  }

  public static getArchive(body: {
    [key: string]: string[];
  }): Promise<{ [key: string]: MemberProfile[] }> {
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

  public static getMemberProperties(member: IdolMember): Promise<MemberProperties | undefined> {
    const res = APIWrapper.get(`${backendURL}/member-properties/${member.email}`).then(
      (res) => res.data
    );

    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get member properties",
          contentMsg: `Error was: ${val.err}`
        });
        return undefined;
      }
      const member = val.member as MemberProperties;
      return member;
    });
  }

  private static haveNoCommonSubteams(member1: IdolMember, member2: IdolMember): boolean {
    return (
      member2.subteams.every((team) => !member1.subteams.includes(team)) &&
      member1.subteams.every((team) => !member2.subteams.includes(team))
    );
  }

  public static async checkMemberMeetsCategory(
    otherMember: IdolMember,
    submitter: IdolMember,
    category: string
  ): Promise<boolean | undefined> {
    const otherMemberProperties = await this.getMemberProperties(otherMember);
    const submitterProperties = await this.getMemberProperties(submitter);
    if (category === 'an alumni') {
      return (await this.getAllMembers()).every((member) => member.email !== otherMember.email);
    }
    if (category === 'courseplan member') {
      return otherMember.subteams.includes('courseplan');
    }
    if (category === 'a pm (not your team)') {
      return otherMember.role === 'pm' && this.haveNoCommonSubteams(submitter, otherMember);
    }
    if (category === 'business member') {
      return otherMember.role === 'business';
    }
    if (category === 'is/was a TA') {
      return otherMemberProperties ? otherMemberProperties.ta : undefined;
    }
    if (category === 'major/minor that is not cs/infosci') {
      return otherMemberProperties ? otherMemberProperties.notCsOrInfosci : undefined;
    }
    if (category === 'idol member') {
      return otherMember.subteams.includes('idol');
    }
    if (category === 'a newbie') {
      return otherMemberProperties ? otherMemberProperties.newbie : undefined;
    }
    if (category === 'from a different college') {
      return otherMemberProperties && submitterProperties
        ? otherMemberProperties.college !== submitterProperties.college
        : undefined;
    }
    if (category === 'curaise member') {
      return otherMember.subteams.includes('curaise');
    }
    if (category === 'cornellgo member') {
      return otherMember.subteams.includes('cornellgo');
    }
    if (category === 'a tpm (not your team)') {
      return otherMember.role === 'tpm' && this.haveNoCommonSubteams(submitter, otherMember);
    }
    if (category === 'carriage member') {
      return otherMember.subteams.includes('carriage');
    }
    if (category === 'qmi member') {
      return otherMember.subteams.includes('queuemein');
    }
    if (category === 'a lead (not your role)') {
      return (
        otherMember.role === 'lead' &&
        (submitter.role !== 'lead'
          ? otherMemberProperties?.leadType !== submitter.role
          : otherMemberProperties?.leadType !== submitterProperties?.leadType)
      );
    }
    if (category === 'cuapts member') {
      return otherMember.subteams.includes('cuapts');
    }
    Emitters.generalError.emit({
      headerMsg: 'Given category is not valid',
      contentMsg: 'Enter a category that is from this semester!'
    });
    return undefined;
  }
}
