import { firestore } from 'firebase-admin';

export type Role =
  | 'lead'
  | 'admin'
  | 'tpm'
  | 'pm'
  | 'developer'
  | 'designer'
  | 'business';

export type RoleDescription =
  | 'Lead'
  | 'Admin'
  | 'Technical PM'
  | 'Product Manager'
  | 'Developer'
  | 'Designer'
  | 'Business Analyst';

export type Member = {
  email: string;
  netid: string;
  firstName: string;
  lastName: string;
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
  role: Role;
  roleDescription: roleDescription;
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
