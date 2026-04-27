/**
 * Utility functions for determining reimbursement permissions based on user roles.
 *
 * Permission model:
 * - Biz leads have admin permissions (can approve/manage all requests)
 * - Other leads and ops have requester permissions (can submit requests)
 */

/**
 * Determines if a user has admin permissions for reimbursements.
 * @param role - The user's Role
 * @returns true if the user has admin permissions
 */
export function hasReimbursementAdminPermissions(role: Role): boolean {
  return role === 'business-lead';
}

/**
 * Determines if a user has requester permissions for reimbursements.
 * @param role - The user's Role
 * @returns true if the user has requester permissions
 */
export function hasReimbursementRequesterPermissions(role: Role): boolean {
  const leadRoles: Role[] = [
    'ops-lead',
    'product-lead',
    'dev-lead',
    'design-lead',
    'business-lead'
  ];

  return leadRoles.includes(role);
}

/**
 * Determines if a user can access the reimbursement system at all.
 * @param role - The user's Role
 * @returns true if the user has any reimbursement permissions
 */
export function hasAnyReimbursementPermissions(role: Role): boolean {
  return hasReimbursementAdminPermissions(role) || hasReimbursementRequesterPermissions(role);
}
