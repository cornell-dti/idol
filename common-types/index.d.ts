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
  | 'business-advisor'
  | 'alum';

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
  | 'Business Advisor'
  | 'Alumni';

/** The possible colleges an IDOL member could be. */
type College = 'eng' | 'cas' | 'cals' | 'dyson' | 'humec' | 'hotel' | 'ilr' | 'brooks' | 'aap';

type Major =
  | 'Africana Studies'
  | 'Agricultural Sciences'
  | 'American Studies'
  | 'Animal Science'
  | 'Anthropology'
  | 'Applied Economics and Management'
  | 'Archaeology'
  | 'Architecture'
  | 'Asian Studies'
  | 'Astronomy'
  | 'Atmospheric Science'
  | 'Biological Engineering'
  | 'Biological Sciences'
  | 'Biology and Society'
  | 'Biomedical Engineering'
  | 'Biometry and Statistics'
  | 'Chemical Engineering'
  | 'Chemistry'
  | 'China and Asia-Pacific Studies'
  | 'Civil Engineering'
  | 'Classics'
  | 'Cognitive Science'
  | 'College Scholar'
  | 'Communication'
  | 'Comparative Literature'
  | 'Computer Science'
  | 'Design and Environmental Analysis'
  | 'Earth and Atmospheric Sciences'
  | 'Economics'
  | 'Electrical and Computer Engineering'
  | 'Engineering Physics'
  | 'English'
  | 'Entomology'
  | 'Environment and Sustainability'
  | 'Environmental Engineering'
  | 'Fashion Design and Management'
  | 'Feminist, Gender, and Sexuality Studies'
  | 'Fiber Science'
  | 'Fine Arts'
  | 'Food Science'
  | 'French'
  | 'German Studies'
  | 'Global and Public Health Sciences'
  | 'Global Development'
  | 'Government'
  | 'Health Care Policy'
  | 'History'
  | 'History of Art'
  | 'Hotel Administration'
  | 'Human Biology, Health, and Society'
  | 'Human Development'
  | 'Independent Major'
  | 'Industrial and Labor Relations (ILR)'
  | 'Information Science'
  | 'Information Science, Systems, and Technology'
  | 'Italian'
  | 'Jewish Studies'
  | 'Landscape Architecture'
  | 'Linguistics'
  | 'Materials Science and Engineering'
  | 'Mathematics'
  | 'Mechanical Engineering'
  | 'Music'
  | 'Near Eastern Studies'
  | 'Nutritional Sciences'
  | 'Operations Research and Engineering'
  | 'Performing and Media Arts'
  | 'Philosophy'
  | 'Physics'
  | 'Plant Sciences'
  | 'Psychology'
  | 'Public Policy'
  | 'Religious Studies'
  | 'Science and Technology Studies'
  | 'Sociology'
  | 'Spanish'
  | 'Statistical Science'
  | 'Undecided'
  | 'Urban and Regional Studies'
  | 'Viticulture and Enology';

type Minor =
  | 'Actuarial Science'
  | 'Aerospace Engineering'
  | 'Africana Studies'
  | 'American Indian and Indigenous Studies'
  | 'American Sign Language | Deaf Studies'
  | 'American Studies'
  | 'Animal Science'
  | 'Anthropology'
  | 'Applied Economics'
  | 'Applied Exercise Science'
  | 'Applied Mathematics'
  | 'Arabic'
  | 'Archaeology'
  | 'Architecture'
  | 'Artificial Intelligence'
  | 'Asian American Studies'
  | 'Astrobiology'
  | 'Astronomy'
  | 'Atmospheric Science'
  | 'Biological Engineering'
  | 'Biomedical Engineering'
  | 'Biomedical Sciences'
  | 'Biometry and Statistics'
  | 'Business'
  | 'Caribbean Studies'
  | 'China and Asia-Pacific Studies'
  | 'Civil Infrastructure'
  | 'Classical Civilization'
  | 'Classics'
  | 'Climate Change'
  | 'Cognitive Science'
  | 'Communication'
  | 'Community Food Systems'
  | 'Comparative Literature'
  | 'Computer Science'
  | 'Creative Writing'
  | 'Crime, Prisons, Education, and Justice'
  | 'Crop Management'
  | 'Dance'
  | 'Data Science'
  | 'Data Science in Astronomy'
  | 'Demography'
  | 'Design and Environmental Analysis'
  | 'Digital Agriculture'
  | 'Dyson Business Minor for Engineers'
  | 'Dyson Business Minor for Life Sciences'
  | 'Earth and Atmospheric Sciences'
  | 'East Asian Studies'
  | 'Education'
  | 'Electrical and Computer Engineering'
  | 'Engineering Communications'
  | 'Engineering Management'
  | 'English'
  | 'Entomology'
  | 'Entrepreneurship'
  | 'Environment and Sustainability'
  | 'Environmental Engineering'
  | 'European Studies'
  | 'Fashion Studies'
  | 'Feminist, Gender, and Sexuality Studies'
  | 'Fiber Science'
  | 'Film'
  | 'Fine Arts'
  | 'Food and Agricultural Business'
  | 'Food Science'
  | 'French'
  | 'Fungal Biology'
  | 'Game Design'
  | 'German Studies'
  | 'Gerontology'
  | 'Global Asia Studies'
  | 'Global Development'
  | 'Global Health'
  | 'Health Policy'
  | 'Healthy Futures'
  | 'History'
  | 'History of Art'
  | 'History of Capitalism'
  | 'Horticulture'
  | 'Human Development'
  | 'Inequality Studies'
  | 'Infectious Disease Biology'
  | 'Information Science'
  | 'International Markets and Development'
  | 'International Relations'
  | 'Italian'
  | 'Jewish Studies'
  | 'Landscape Architecture'
  | 'Latin American Studies'
  | 'Latina/o Studies'
  | 'Law and Society'
  | 'Leadership'
  | 'Lesbian, Gay, Bisexual, and Transgender Studies'
  | 'Linguistics'
  | 'Marine Biology'
  | 'Materials Science and Engineering'
  | 'Mathematics'
  | 'Mechanical Engineering'
  | 'Media Studies'
  | 'Medieval Studies'
  | 'Microbial Sciences'
  | 'Migration Studies'
  | 'Minority, Indigenous, and Third World Studies'
  | 'Moral Psychology'
  | 'Music'
  | 'Near Eastern Studies'
  | 'Nutrition and Health'
  | 'Operations Research & Management Science'
  | 'Performing and Media Arts'
  | 'Philosophy'
  | 'Physics'
  | 'Plant Breeding'
  | 'Plant Sciences'
  | 'Policy Analysis and Management'
  | 'Portuguese and Brazilian Studies'
  | 'Psychology'
  | 'Public History'
  | 'Public Policy'
  | 'Public Service Studies'
  | 'Real Estate'
  | 'Religious Studies'
  | 'Robotics'
  | 'Russian'
  | 'Sanskrit Studies'
  | 'Science and Technology Studies'
  | 'Science Communication and Public Engagement'
  | 'Smart Cities'
  | 'Soil Science'
  | 'South Asian Studies'
  | 'Southeast Asian Studies'
  | 'Spanish'
  | 'Sustainable Agricultural and Food Systems'
  | 'Sustainable Business and Economic Policy'
  | 'Sustainable Energy Systems'
  | 'Theatre'
  | 'Urban and Regional Studies'
  | 'Viking Studies'
  | 'Visual Studies'
  | 'Viticulture & Enology';

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
