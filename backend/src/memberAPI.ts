import { Request } from 'express';
import MembersDao from './dao/MembersDao';
import { PermissionsManager } from './permissions';
import {
  BadRequestError,
  UnauthorizedError,
  PermissionError,
  NotFoundError
} from './errors';

export const allMembers = (): Promise<readonly IdolMember[]> =>
  MembersDao.getAllMembers();

export const setMember = async (req: Request): Promise<IdolMember> => {
  const userEmail: string = req.session?.email as string;
  const user = await MembersDao.getMember(userEmail);
  if (!user) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to edit members!`
    );
  }
  if (!req.body.email || req.body.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  return MembersDao.setMember(req.body.email, req.body);
};

export const updateMember = async (req: Request): Promise<IdolMember> => {
  const userEmail: string = req.session?.email as string;
  const user = await MembersDao.getMember(userEmail);
  if (!user) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit && user.email !== req.body.email) {
    // members are able to edit their own information
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to edit members!`
    );
  }
  if (!req.body.email || req.body.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  if (
    !canEdit &&
    (req.body.role !== user.role ||
      req.body.firstName !== user.firstName ||
      req.body.lastName !== user.lastName)
  ) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to edit member name or roles!`
    );
  }
  return MembersDao.updateMember(req.body.email, req.body);
};

export const getMember = async (req: Request): Promise<IdolMember> => {
  const userEmail: string = req.session?.email as string;
  const user = await MembersDao.getMember(userEmail);
  if (!user) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit: boolean = await PermissionsManager.canEditMembers(user);
  const memberEmail: string = req.params.email;
  if (!canEdit && memberEmail !== userEmail) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to get members!`
    );
  }
  const member = await MembersDao.getMember(memberEmail);
  if (member == null) {
    throw new NotFoundError(`Member with email: ${memberEmail} does not exist`);
  }
  return member;
};

export const deleteMember = async (req: Request): Promise<void> => {
  const userEmail: string = req.session?.email as string;
  const user = await MembersDao.getMember(userEmail);
  if (!user) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to delete members!`
    );
  }
  const { email } = req.params;
  if (!email || email === '') {
    throw new BadRequestError("Couldn't delete member with undefined email!");
  }
  await MembersDao.deleteMember(email);
};
