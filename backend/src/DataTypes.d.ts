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
