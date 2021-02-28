import { firestore } from 'firebase-admin';

export type Role = 'lead' | 'admin' | 'tpm' | 'pm' | 'developer' | 'designer';

export type Member = {
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  graduation: string;
  major: string;
  double_major?: string; // optional
  minor?: string; // optional
  website?: string; // optional
  linkedin_link?: string; // optional
  github_link?: string; // optional
  hometown: string;
  about: string;
  subteam: string;
  other_subteams?: string[]; // optional
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
