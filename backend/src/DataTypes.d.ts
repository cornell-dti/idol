import { firestore } from 'firebase-admin';

export type DBTeam = {
  uuid: string;
  name: string;
  leaders: firestore.DocumentReference[];
  members: firestore.DocumentReference[];
  formerMembers: firestore.DocumentReference[];
};

export type Team = {
  uuid: string;
  name: string;
  leaders: IdolMember[];
  members: IdolMember[];
  formerMembers: IdolMember[];
};

export type DBShoutout = {
  giver: firestore.DocumentReference;
  receiver: firestore.DocumentReference;
  message: string;
  isAnon: boolean;
};

export type Shoutout = {
  giver: IdolMember;
  receiver: IdolMember;
  message: string;
  isAnon: boolean;
};

export type DBSignInForm = {
  users: { signedInAt: number; user: firestore.DocumentReference }[];
  createdAt: number;
  id: string;
};

export type SignInForm = {
  users: { signedInAt: number; user: IdolMember }[];
  createdAt: number;
  id: string;
};
