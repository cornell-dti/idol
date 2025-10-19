import { firestore } from 'firebase-admin';

export type Team = {
  uuid: string;
  name: string;
  leaders: IdolMember[];
  members: IdolMember[];
  formerMembers: IdolMember[];
};

export type DBShoutout = {
  giver: firestore.DocumentReference;
  receiver: string;
  message: string;
  isAnon: boolean;
  timestamp: number;
  hidden: boolean;
  uuid: string;
  images?: string[];
};

export type DBSignInFormResponse = {
  signedInAt: number;
  user: firestore.DocumentReference;
  response: string | null;
};

export type DBSignInForm = {
  users: DBSignInFormResponse[];
  createdAt: number;
  expireAt: number;
  id: string;
  prompt: string | null;
};

export type DBTeamEventAttendance = {
  member: firestore.DocumentReference;
  hoursAttended?: number;
  image: string;
  eventUuid: string;
  status: Status;
  reason: string;
  uuid: string;
};

export type DBCandidateDeciderRating = {
  readonly reviewer: firestore.DocumentReference;
  readonly rating: Rating;
};

export type DBCandidateDeciderComment = {
  readonly reviewer: firestore.DocumentReference;
  readonly comment: string;
};

export type DBCandidateDeciderCandidate = {
  readonly responses: string[];
  readonly id: number;
};

export type DBCandidateDeciderReview = {
  readonly candidateDeciderInstanceUuid: string;
  readonly candidateId: number;
  readonly reviewer: firestore.DocumentReference;
  readonly rating: Rating;
  readonly comment: string;
  readonly uuid: string;
};

export type DBCandidateDeciderInstance = {
  readonly name: string;
  readonly headers: string[];
  readonly candidates: DBCandidateDeciderCandidate[];
  readonly uuid: string;
  readonly authorizedMembers: firestore.DocumentReference[];
  readonly authorizedRoles: Role[];
  isOpen: boolean;
};

export type DBDevPortfolio = {
  name: string;
  deadline: number;
  earliestValidDate: number;
  submissions: DBDevPortfolioSubmission[];
  lateDeadline: number | null;
  readonly uuid: string;
};

export type DBDevPortfolioSubmission = {
  member: firestore.DocumentReference;
  openedPRs: PullRequestSubmission[];
  reviewedPRs: PullRequestSubmission[];
  otherPRs: PullRequestSubmission[];
  isLate?: boolean;
  text?: string;
  documentationText?: string;
  status: SubmissionStatus;
};

export type DevPortfolioSubmissionRequestLog = {
  timestamp: string;
  email: string;
  body: {
    submission: DBDevPortfolioSubmission;
    uuid: string;
  };
};

export type DBCoffeeChat = {
  uuid: string;
  submitter: firestore.DocumentReference;
  otherMember: firestore.DocumentReference | IdolMember;
  isNonIDOLMember: boolean;
  slackLink: string;
  category: string;
  status: Status;
  date: number;
  isArchived: boolean;
  memberMeetsCategory: MemberMeetsCategoryStatus;
  reason?: string;
  errorMessage?: string;
};

export type DBInterviewSlot = {
  readonly interviewSchedulerUuid: string;
  readonly startTime: number;
  readonly room: string;
  readonly uuid: string;
  lead: firestore.DocumentReference | null;
  members: (firestore.DocumentReference | null)[];
  applicant: Applicant | null;
};

export type DBAlumni = {
  readonly firstName: string;
  readonly lastName: string;
  readonly gradYear: number;
  readonly email: string;
  readonly subteam: string;
  readonly dtiRole: string;
  readonly linkedin?: string | null;
  readonly location?: string | null;
  readonly company?: string;
  readonly industry?: string;
  readonly jobRole?: string;
  readonly specification?: string | null;
  readonly imageUrl: string;
  readonly timestamp: number;
};
