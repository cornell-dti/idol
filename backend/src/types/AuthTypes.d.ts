type AuthLead =
  | 'lead'
  | 'dev_lead'
  | 'ops_lead'
  | 'lead'
  | 'design_lead'
  | 'business_lead'
  | 'ci_lead'
  | 'pm_lead';

export type AuthRole =
  | undefined
  | 'admin'
  | 'dev'
  | 'tpm'
  | 'pm'
  | 'designer'
  | 'business'
  | AuthLead;

export interface AuthRoleDoc {
  role: AuthRole;
}

export interface RBACConfig {
  resources: {
    [resourceName: string]: {
      read_only: AuthRole[];
      read_and_write: AuthRole[];
      has_metadata: boolean;
      has_owner: boolean;
    };
  };
}
