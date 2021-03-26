import { firestore } from 'firebase-admin';

export type ProfileImage = {
  url: string;
  fileName: string;
};

export type DBTeam = {
  uuid: string;
  name: string;
  leaders: firestore.DocumentReference[];
  members: firestore.DocumentReference[];
};

export type Team = {
  uuid: string;
  name: string;
  leaders: IdolMember[];
  members: IdolMember[];
};
