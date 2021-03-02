import { Member, Team } from './DataTypes';

type DBResult = { isSuccessful: boolean; error?: string };

type DBAllMembersResult = { members: Member[] } & DBResult;

type DBMemberResult = { member: Member } & DBResult;

type DBAllTeamsResult = { teams: Team[] } & DBResult;

type DBTeamResult = { team: Team } & DBResult;
