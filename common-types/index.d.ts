/** The common types required by more than one workspace. */
import { SignInForm } from '../backend/src/DataTypes';

export {};

declare global {
  /** All possible roles for a DTI member */
  type Role = 'lead' | 'tpm' | 'pm' | 'developer' | 'designer' | 'business';

  /** The corresponding more human readable role description of all roles. */
  type RoleDescription =
    | 'Lead'
    | 'Technical PM'
    | 'Product Manager'
    | 'Developer'
    | 'Designer'
    | 'Business Analyst';

  /** The data type used by IDOL to represent a DTI member. */
  interface IdolMember {
    readonly netid: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly graduation: string;
    readonly major: string;
    readonly doubleMajor?: string | null;
    readonly minor?: string | null;
    readonly website?: string | null;
    readonly linkedin?: string | null;
    readonly github?: string | null;
    readonly hometown: string;
    readonly about: string;
    readonly subteams: readonly string[];
    readonly formerSubteams?: readonly string[] | null;
    readonly role: Role;
    readonly roleDescription: RoleDescription;
  }

  interface IdolMemberDiff {
    /** Email of the member. */
    readonly email: string;
    readonly diffString: string;
  }

  /** The data type used by Nova site to represent a DTI member. */
  interface NovaMember {
    readonly netid: string;
    readonly name: string;
    readonly isLead?: boolean;
    readonly graduation: string;
    readonly major: string;
    readonly doubleMajor?: string;
    readonly minor?: string;
    readonly website?: string;
    readonly linkedin?: string;
    readonly github?: string;
    readonly hometown: string;
    readonly about: string;
    readonly subteams?: string[];
    readonly formerSubteams?: string[];
    readonly roleId: string;
    readonly roleDescription: string;
  }

  interface ProfileImage {
    readonly url: string;
    readonly fileName: string;
  }

  type SignInCheckRequest = {
    id: string;
  };

  type SignInCheckResponse = {
    exists: boolean;
  };

  type SignInSubmitRequest = {
    id: string;
  };

  type SignInSubmitResponse = {
    success: boolean;
    signedInAt: number;
    id: string;
    error?: string;
  };

  type SignInCreateRequest = {
    id: string;
  };

  type SignInCreateResponse = {
    success: boolean;
    createdAt?: number;
    id: string;
    error?: Record<string, unknown>;
  };

  type SignInDeleteRequest = {
    id: string;
  };

  type SignInDeleteResponse = {
    success: boolean;
    error?: Record<string, unknown>;
  };

  type SignInAllResponse = {
    forms: SignInForm[];
  };
}
