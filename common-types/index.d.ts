/** The common types required by more than one workspace. */

/** Overarching team roles for DTI members */
type GeneralRole = 'lead' | 'designer' | 'pm' | 'business' | 'developer';

/** Possible statuses for DTI applicants */
type IntStatus = 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided';

/** All possible rounds for DTI applicants */
type Round = 'Behavioral' | 'Resume' | 'Technical';

/** Round filters for InterviewStatusDashboard */
type RoundFilter = 'All Rounds' | Round;

/** All possible roles for a DTI member */
type Role =
  | 'ops-lead'
  | 'product-lead'
  | 'dev-lead'
  | 'design-lead'
  | 'business-lead'
  | 'tpm'
  | 'pm'
  | 'apm'
  | 'developer'
  | 'designer'
  | 'business'
  | 'pm-advisor'
  | 'dev-advisor'
  | 'design-advisor'
  | 'business-advisor';

/** The corresponding more human readable role description of all roles. */
type RoleDescription =
  | 'Full Team Lead'
  | 'Product Lead'
  | 'Developer Lead'
  | 'Design Lead'
  | 'Business Lead'
  | 'Technical PM'
  | 'Product Manager'
  | 'Associate PM'
  | 'Developer'
  | 'Designer'
  | 'Business'
  | 'PM Advisor'
  | 'Dev Advisor'
  | 'Design Advisor'
  | 'Business Advisor';

/** The possible colleges an IDOL member could be. */
type College = 'eng' | 'cas' | 'cals' | 'dyson' | 'humec' | 'hotel' | 'ilr' | 'brooks' | 'aap';

/** The data type used by IDOL to represent a DTI member. */
interface IdolMember {
  readonly netid: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly pronouns: string;
  readonly semesterJoined: string;
  readonly graduation: string;
  readonly college?: College;
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
  readonly coffeeChatLink?: string | null;
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

type Rating = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  submitRepo?: boolean;
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
  readonly isArchived: boolean;
  readonly memberMeetsCategory: MemberMeetsCategoryStatus;
  readonly reason?: string;
  readonly errorMessage?: string;
}

interface MemberProperties {
  readonly college: string;
  readonly newbie: boolean;
  readonly notCsOrInfosci: boolean;
  readonly ta: boolean;
}
type MemberMeetsCategoryStatus = 'pass' | 'fail' | 'no data';
type MemberMeetsCategoryType = { status: MemberMeetsCategoryStatus; message: string };

interface MemberDetails {
  readonly name: string;
  readonly netid: string;
}

type CoffeeChatSuggestions = { [k: string]: MemberDetails[] };

type Applicant = {
  firstName: string;
  lastName: string;
  email: string;
  netid: string;
};

type SlotStatus = 'vacant' | 'occupied' | 'possessed';

interface InterviewScheduler {
  readonly name: string;
  readonly duration: number;
  readonly membersPerSlot: number;
  readonly isOpen: boolean;
  readonly startDate: number;
  readonly endDate: number;
  readonly applicants: Applicant[];
  readonly uuid: string;
}

interface InterviewSlot {
  readonly interviewSchedulerUuid: string;
  readonly startTime: number;
  readonly room: string;
  readonly lead: IdolMember | null;
  readonly members: (IdolMember | null)[];
  readonly applicant: Applicant | null;
  readonly uuid: string;
}

interface InterviewSchedulerEdit {
  readonly uuid: string;
  isOpen?: boolean;
  startDate?: number;
  endDate?: number;
}

interface InterviewSlotEdit {
  readonly uuid: string;
  readonly interviewSchedulerUuid: string;
  lead?: IdolMember | null;
  members?: (IdolMember | null)[];
  applicant?: Applicant | null;
}

interface StatusInstance {
  instanceName: string;
  statuses: InterviewStatus[];
}

interface InterviewStatus {
  instance: string;
  name: string;
  netid: string;
  role: GeneralRole;
  round: Round;
  status: IntStatus;
  readonly uuid?: string;
}

interface Period {
  name: string;
  start: Date;
  deadline: Date;
  events: TeamEvent[];
}
