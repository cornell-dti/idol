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

interface TeamEventAttendance {
  member: IdolMember;
  hoursAttended?: number;
  image: string;
}

interface TeamEvent {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  readonly attendees: TeamEventAttendance[];
  readonly requests: TeamEventAttendance[];
  readonly uuid: string;
}

interface EventProofImage {
  readonly url: string;
  readonly fileName: string;
}

type Rating = 0 | 1 | 2 | 3 | 4 | 5;

interface CandidateDeciderRating {
  readonly reviewer: IdolMember;
  readonly rating: Rating;
}

interface CandidateDeciderComment {
  readonly reviewer: IdolMember;
  readonly comment: string;
}

interface CandidateDeciderCandidate {
  readonly responses: string[];
  readonly id: number;
  ratings: CandidateDeciderRating[];
  comments: CandidateDeciderComment[];
}

interface CandidateDeciderInstance {
  readonly name: string;
  readonly headers: string[];
  readonly candidates: CandidateDeciderCandidate[];
  readonly uuid: string;
  readonly authorizedMembers: IdolMember[];
  readonly authorizedRoles: Role[];
  isOpen: boolean;
}

interface CandidateDeciderInfo {
  readonly name: string;
  readonly uuid: string;
  isOpen: boolean;
}

interface PullRequestSubmission {
  url: string;
  status: 'valid' | 'invalid' | 'pending';
  reason?: string | null;
}

interface DevPortfolio {
  name: string;
  deadline: number;
  earliestValidDate: number;
  submissions: DevPortfolioSubmission[];
  readonly uuid: string;
  lateDeadline: number | null;
}

interface DevPortfolioSubmission {
  member: IdolMember;
  openedPRs: PullRequestSubmission[];
  reviewedPRs: PullRequestSubmission[];
  isLate?: boolean;
  text?: string;
}

interface DevPortfolioInfo {
	name: string;
	deadline: number;
	earliestValidDate: number;
	uuid: string;
}
