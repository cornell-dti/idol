import { getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Firestore, getFirestore, collection } from 'firebase/firestore';
import { useProdDb, environment } from './environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFirebaseConfig = (environment?: string): any => {
  let useProdFirebase;
  if (environment === 'prod') useProdFirebase = true;
  else if (environment === 'staging') useProdFirebase = false;
  else useProdFirebase = useProdDb;

  return useProdFirebase
    ? {
        apiKey: 'AIzaSyCCT5j588crPFvtKW5jM7Zkb_DLU_61VdY',
        authDomain: 'idol-b6c68.firebaseapp.com',
        databaseURL: 'https://idol-b6c68.firebaseio.com',
        projectId: 'idol-b6c68',
        storageBucket: 'idol-b6c68.appspot.com',
        messagingSenderId: '223626581097',
        appId: '1:223626581097:web:e80e98596d60486be03ef8',
        measurementId: 'G-90WYJ18WZX'
      }
    : {
        apiKey: 'AIzaSyAIaEs6YX6HLbsvCJ_P6A3tO9s2rlFBV-s',
        authDomain: 'cornelldti-idol.firebaseapp.com',
        projectId: 'cornelldti-idol',
        storageBucket: 'cornelldti-idol.appspot.com',
        messagingSenderId: '942472815572',
        appId: '1:942472815572:web:69a29aa06012cf8165ac41',
        measurementId: 'G-2QB5YJ3CHC'
      };
};

const app = !getApps().length ? initializeApp(getFirebaseConfig(environment)) : getApps()[0];

export const auth: Auth = getAuth(app);
export const provider: GoogleAuthProvider = new GoogleAuthProvider();

export const db: Firestore = getFirestore(app);
export const adminsCollection = collection(db, 'admins');
export const membersCollection = collection(db, 'members').withConverter({
  fromFirestore(snapshot): IdolMember {
    return snapshot.data() as IdolMember;
  },
  toFirestore(teamEventData: IdolMember) {
    return teamEventData;
  }
});
export const approvedMembersCollection = collection(db, 'approved-members').withConverter({
  fromFirestore(snapshot): IdolMember {
    return snapshot.data() as IdolMember;
  },
  toFirestore(teamEventData: IdolMember) {
    return teamEventData;
  }
});
