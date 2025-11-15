import admin from 'firebase-admin';
import {
  DBShoutout,
  DBSignInForm,
  DBCandidateDeciderInstance,
  DBDevPortfolio,
  DevPortfolioSubmissionRequestLog,
  DBTeamEventAttendance,
  DBCandidateDeciderReview,
  DBCoffeeChat,
  DBInterviewSlot,
  DBCityCoordinates
} from './types/DataTypes';
import { configureAccount } from './utils/firebase-utils';

require('dotenv').config();

const useProdDb: boolean = process.env.USE_PROD_DB
  ? JSON.parse(process.env.USE_PROD_DB as string)
  : true;

export const env: string | undefined = process.env.ENV;

const useProdFirebaseConfig = !(env === 'prod' || env === 'staging') ? useProdDb : env === 'prod';

const prodServiceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');
const devServiceAccount = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');

const serviceAccount = useProdFirebaseConfig ? prodServiceAccount : devServiceAccount;

export const app = admin.initializeApp({
  credential: admin.credential.cert(
    configureAccount(serviceAccount, useProdFirebaseConfig ? 'prod' : 'dev')
  ),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: useProdFirebaseConfig
    ? 'gs://idol-b6c68.appspot.com'
    : 'gs://cornelldti-idol.appspot.com'
});

export const bucket = admin.storage().bucket();
export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const memberCollection: admin.firestore.CollectionReference<IdolMember> = db
  .collection('members')
  .withConverter({
    fromFirestore(snapshot): IdolMember {
      return snapshot.data() as IdolMember;
    },
    toFirestore(userData: IdolMember) {
      return userData;
    }
  });

export const approvedMemberCollection: admin.firestore.CollectionReference<IdolMember> = db
  .collection('approved-members')
  .withConverter({
    fromFirestore(snapshot): IdolMember {
      return snapshot.data() as IdolMember;
    },
    toFirestore(userData: IdolMember) {
      return userData;
    }
  });

export const memberPropertiesCollection: admin.firestore.CollectionReference<MemberProperties> = db
  .collection('member-properties')
  .withConverter({
    fromFirestore(snapshot): MemberProperties {
      return snapshot.data() as MemberProperties;
    },
    toFirestore(userData: MemberProperties) {
      return userData;
    }
  });

export const coffeeChatSuggestionsCollection: admin.firestore.CollectionReference<CoffeeChatSuggestions> =
  db.collection('coffee-chat-suggestions').withConverter({
    fromFirestore(snapshot): CoffeeChatSuggestions {
      return snapshot.data() as CoffeeChatSuggestions;
    },
    toFirestore(userData: CoffeeChatSuggestions) {
      return userData;
    }
  });

export const shoutoutCollection: admin.firestore.CollectionReference<DBShoutout> = db
  .collection('shoutouts')
  .withConverter({
    fromFirestore(snapshot): DBShoutout {
      return snapshot.data() as DBShoutout;
    },
    toFirestore(shoutoutData: DBShoutout) {
      return shoutoutData;
    }
  });

export const signInFormCollection: admin.firestore.CollectionReference<DBSignInForm> = db
  .collection('sign-in-forms')
  .withConverter({
    fromFirestore(snapshot): DBSignInForm {
      return snapshot.data() as DBSignInForm;
    },
    toFirestore(signInData: DBSignInForm) {
      return signInData;
    }
  });

export const teamEventAttendanceCollection: admin.firestore.CollectionReference<DBTeamEventAttendance> =
  db.collection('team-event-attendance').withConverter({
    fromFirestore(snapshot): DBTeamEventAttendance {
      return snapshot.data() as DBTeamEventAttendance;
    },
    toFirestore(teamEventAttendanceData: DBTeamEventAttendance) {
      return teamEventAttendanceData;
    }
  });

export const teamEventsCollection: admin.firestore.CollectionReference<TeamEventInfo> = db
  .collection('team-events')
  .withConverter({
    fromFirestore(snapshot): TeamEventInfo {
      return snapshot.data() as TeamEventInfo;
    },
    toFirestore(teamEventData: TeamEventInfo) {
      return teamEventData;
    }
  });

export const candidateDeciderCollection: admin.firestore.CollectionReference<DBCandidateDeciderInstance> =
  db.collection('candidate-decider').withConverter({
    fromFirestore(snapshot): DBCandidateDeciderInstance {
      return snapshot.data() as DBCandidateDeciderInstance;
    },
    toFirestore(data: DBCandidateDeciderInstance) {
      return data;
    }
  });

export const devPortfolioCollection: admin.firestore.CollectionReference<DBDevPortfolio> = db
  .collection('dev-portfolio')
  .withConverter({
    fromFirestore(snapshot): DBDevPortfolio {
      return snapshot.data() as DBDevPortfolio;
    },
    toFirestore(devPortfolioData: DBDevPortfolio) {
      return devPortfolioData;
    }
  });

export const devPortfolioSubmissionRequestLogCollection: admin.firestore.CollectionReference<DevPortfolioSubmissionRequestLog> =
  db.collection('dev-portfolio-submission-request-logs').withConverter({
    fromFirestore(snapshot): DevPortfolioSubmissionRequestLog {
      return snapshot.data() as DevPortfolioSubmissionRequestLog;
    },
    toFirestore(requestLog: DevPortfolioSubmissionRequestLog) {
      return requestLog;
    }
  });

export const coffeeChatsCollection: admin.firestore.CollectionReference<DBCoffeeChat> = db
  .collection('coffee-chats')
  .withConverter({
    fromFirestore(snapshot): DBCoffeeChat {
      return snapshot.data() as DBCoffeeChat;
    },
    toFirestore(coffeeChatData: DBCoffeeChat) {
      return coffeeChatData;
    }
  });

export const adminCollection: admin.firestore.CollectionReference = db.collection('admins');

export const teamEventAdminCollection: admin.firestore.CollectionReference =
  db.collection('team-event-admins');

export const candidateDeciderReviewCollection: admin.firestore.CollectionReference<DBCandidateDeciderReview> =
  db.collection('candidate-decider-review').withConverter({
    fromFirestore(snapshot): DBCandidateDeciderReview {
      return snapshot.data() as DBCandidateDeciderReview;
    },
    toFirestore(candidateDeciderReviewData: DBCandidateDeciderReview) {
      return candidateDeciderReviewData;
    }
  });

export const interviewSchedulerCollection: admin.firestore.CollectionReference<InterviewScheduler> =
  db.collection('interview-scheduler').withConverter({
    fromFirestore(snapshot): InterviewScheduler {
      return snapshot.data() as InterviewScheduler;
    },
    toFirestore(interviewSchedulerData: InterviewScheduler) {
      return interviewSchedulerData;
    }
  });

export const interviewSlotCollection: admin.firestore.CollectionReference<DBInterviewSlot> = db
  .collection('interview-slots')
  .withConverter({
    fromFirestore(snapshot): DBInterviewSlot {
      return snapshot.data() as DBInterviewSlot;
    },
    toFirestore(interviewSlotData: DBInterviewSlot) {
      return interviewSlotData;
    }
  });

export const interviewStatusCollection: admin.firestore.CollectionReference<InterviewStatus> = db
  .collection('interview-status')
  .withConverter({
    fromFirestore(snapshot): InterviewStatus {
      return snapshot.data() as InterviewStatus;
    },
    toFirestore(interviewStatusData: InterviewStatus) {
      return interviewStatusData;
    }
  });

export const cityCoordinatesCollection: admin.firestore.CollectionReference<DBCityCoordinates> = db
  .collection('city-coordinates')
  .withConverter({
    fromFirestore(snapshot): DBCityCoordinates {
      return snapshot.data() as DBCityCoordinates;
    },
    toFirestore(cityCoordinatesData: DBCityCoordinates) {
      return cityCoordinatesData;
    }
  });
