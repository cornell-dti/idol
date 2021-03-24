import { Member, Team } from './DataTypes';

type DBResult =
  | { readonly isSuccessful: true }
  | { readonly isSuccessful: false; readonly error: string };

type DBAllMembersResult = { readonly members: Member[] } & DBResult;

type DBMemberResult = { readonly member: Member } & DBResult;

type DBAllTeamsResult = { readonly teams: Team[] } & DBResult;

type DBTeamResult = { readonly team: Team } & DBResult;
