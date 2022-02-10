/** The common types required by more than one workspace. */

/** All possible roles for a DTI member */
type Role = 'lead' | 'tpm' | 'pm' | 'developer' | 'designer' | 'business';

/** The corresponding more human readable role description of all roles. */
type RoleDescription =
  | 'Lead'
  | 'Technical PM'
  | 'Product Manager'
  | 'Developer'
  | 'Designer'
  | 'Business Analyst';

/** The data type used by IDOL to represent a DTI member. */
interface IdolMember {
  readonly netid: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly pronouns: string;
  readonly graduation: string;
  readonly major: string;
  readonly doubleMajor?: string | null;
  readonly minor?: string | null;
  readonly website?: string | null;
  readonly linkedin?: string | null;
  readonly github?: string | null;
  readonly hometown: string;
  readonly about: string;
  readonly subteams: readonly string[];
  readonly formerSubteams?: readonly string[] | null;
  readonly role: Role;
  readonly roleDescription: RoleDescription;
}

interface IdolMemberDiff {
  /** Email of the member. */
  readonly email: string;
  readonly diffString: string;
}

/** The data type used by Nova site to represent a DTI member. */
interface NovaMember {
  readonly netid: string;
  readonly name: string;
  readonly pronouns: string;
  readonly isLead?: boolean;
  readonly graduation: string;
  readonly major: string;
  readonly doubleMajor?: string;
  readonly minor?: string;
  readonly website?: string;
  readonly linkedin?: string;
  readonly github?: string;
  readonly hometown: string;
  readonly about: string;
  readonly subteams?: string[];
  readonly formerSubteams?: string[];
  readonly roleId: string;
  readonly roleDescription: string;
}

interface ProfileImage {
  readonly url: string;
  readonly fileName: string;
}

interface SignInForm {
  readonly users: readonly {
    readonly signedInAt: number;
    readonly user: IdolMember;
  }[];
  readonly createdAt: number;
  readonly id: string;
  readonly expireAt: number;
}

interface TeamEvent {
  readonly name: string;
  readonly attendees: IdolMember[];
  readonly uuid: string;
}

interface EventProofImage {
  readonly url: string;
  readonly fileName: string;
}

interface CandidateDeciderInstance {
  readonly name: string;
  readonly headers: string[];
  readonly candidates: any[];
  readonly uuid: string;
  isOpen: boolean;
}
