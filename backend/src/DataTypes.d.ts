import { firestore } from 'firebase-admin';

export type Role = 'lead' | 'admin' | 'tpm' | 'pm' | 'developer' | 'designer';

export type Member = {
  email: string;
  netid: string;
  firstName: string;
  lastName: string;
  role: Role;
  graduation: string;
  major: string;
  doubleMajor?: string; // optional
  minor?: string; // optional
  website?: string; // optional
  linkedin?: string; // optional
  github?: string; // optional
  hometown: string;
  about: string;
  subteam: string;
  otherSubteams?: string[]; // optional
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
  leaders: Member[];
  members: Member[];
};
