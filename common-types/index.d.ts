/** The common types required by more than one workspace. */

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
  readonly subteam: string;
  readonly otherSubteams?: readonly string[] | null;
  readonly role: Role;
  readonly roleDescription: RoleDescription;
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
  readonly subteam?: string;
  readonly otherSubteams?: readonly string[];
  readonly roleId: string;
  readonly roleDescription: string;
}

interface ProfileImage {
  readonly url: string;
  readonly fileName: string;
}
