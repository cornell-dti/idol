/** The common types required by more than one workspace. */

/** All possible roles for a DTI member */
type Role = 'lead' | 'tpm' | 'pm' | 'developer' | 'designer' | 'business' | 'dev-advisor';

/** The corresponding more human readable role description of all roles. */
type RoleDescription =
  | 'Lead'
  | 'Technical PM'
  | 'Product Manager'
  | 'Developer'
  | 'Designer'
  | 'Business Analyst'
  | 'Dev Advisor';

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

/** The data type used by Nova site to represent a DTI member.
 * @deprecated used in past DTI websites
 */
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

/** The data type used by new DTI website to represent a DTI member. */
interface MemberProfile extends IdolMember {
  readonly image?: string | null;
  readonly coffeeChatLink?: string | null;
}

interface ProfileImage {
  readonly url: string;
  readonly fileName: string;
}

interface SignInResponse {
  readonly signedInAt: number;
  readonly user: IdolMember;
  readonly response?: string;
}

interface SignInForm {
  readonly users: SignInResponse[];
  readonly createdAt: number;
  readonly id: string;
  readonly expireAt: number;
  readonly prompt?: string;
}

type Status = 'pending' | 'approved' | 'rejected';

interface TeamEventAttendance {
  member: IdolMember;
  hoursAttended?: number;
  image: string;
  readonly eventUuid: string;
  readonly status: Status;
  readonly reason: string;
  readonly uuid: string;
}

interface TeamEventInfo {
  readonly name: string;
  readonly date: string;
  readonly numCredits: string;
  readonly hasHours: boolean;
  readonly uuid: string;
  readonly isCommunity?: boolean;
  readonly isInitiativeEvent: boolean;
  readonly maxCredits: string;
}

interface TeamEvent extends TeamEventInfo {
  readonly requests: TeamEventAttendance[];
}

interface Image {
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
}

interface CandidateDeciderReview {
  readonly candidateDeciderInstanceUuid: string;
  readonly candidateId: number;
  readonly reviewer: IdolMember;
  readonly rating: Rating;
  readonly comment: string;
  readonly uuid: string;
}

interface CandidateDeciderInstance extends CandidateDeciderInfo {
  readonly headers: string[];
  readonly candidates: CandidateDeciderCandidate[];
  readonly authorizedMembers: IdolMember[];
  readonly authorizedRoles: Role[];
}

interface CandidateDeciderInfo {
  readonly name: string;
  readonly uuid: string;
  isOpen: boolean;
}

interface CandidateDeciderEdit {
  name?: string;
  readonly uuid: string;
  authorizedMembers?: IdolMember[];
  authorizedRoles?: Role[];
  isOpen?: boolean;
}

type SubmissionStatus = 'valid' | 'pending' | 'invalid';

interface PullRequestSubmission {
  url: string;
  status: SubmissionStatus;
  reason?: string | null;
}

interface DevPortfolioSubmission {
  member: IdolMember;
  openedPRs: PullRequestSubmission[];
  reviewedPRs: PullRequestSubmission[];
  otherPRs: PullRequestSubmission[];
  isLate?: boolean;
  text?: string;
  documentationText?: string;
  status: SubmissionStatus;
}

interface DevPortfolioInfo {
  name: string;
  deadline: number;
  earliestValidDate: number;
  readonly uuid: string;
  lateDeadline: number | null;
}

interface DevPortfolio extends DevPortfolioInfo {
  submissions: DevPortfolioSubmission[];
}

interface Shoutout {
  readonly giver: IdolMember;
  readonly receiver: string;
  readonly message: string;
  readonly isAnon: boolean;
  readonly timestamp: number;
  readonly hidden: boolean;
  readonly uuid: string;
  readonly images?: string[];
}

interface CoffeeChat {
  readonly uuid: string;
  readonly submitter: IdolMember;
  readonly otherMember: IdolMember;
  readonly isNonIDOLMember: boolean;
  readonly slackLink: string;
  readonly category: string;
  readonly status: Status;
  readonly date: number;
  readonly memberMeetsCategory: MemberMeetsCategoryStatus;
  readonly reason?: string;
  readonly errorMessage?: string;
}

interface MemberProperties {
  readonly college: string;
  readonly newbie: boolean;
  readonly notCsOrInfosci: boolean;
  readonly ta: boolean;
  readonly leadType?: Role;
}
type MemberMeetsCategoryStatus = 'pass' | 'fail' | 'no data';
type MemberMeetsCategoryType = { status: MemberMeetsCategoryStatus; message: string };
