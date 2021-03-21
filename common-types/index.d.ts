type Role =
  | 'lead'
  | 'admin'
  | 'tpm'
  | 'pm'
  | 'developer'
  | 'designer'
  | 'business';

type RoleDescription =
  | 'Lead'
  | 'Admin'
  | 'Technical PM'
  | 'Product Manager'
  | 'Developer'
  | 'Designer'
  | 'Business Analyst';

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

interface NovaMember {
  readonly netid: string;
  readonly name: string;
  readonly firstName: string;
  readonly lastName: string;
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
