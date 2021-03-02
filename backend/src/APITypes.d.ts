import { Member, Team } from './DataTypes';

type APIResponse = { status: number };

// Errors
export type ErrorResponse = APIResponse & { error: string };

// Members
export type MemberResponse = APIResponse & { member: Member };
export type AllMembersResponse = APIResponse & { members: Member[] };

// Teams
export type TeamResponse = APIResponse & { team: Team };
export type AllTeamsResponse = APIResponse & { teams: Team[] };
