import { Request, Response } from 'express';
import MembersDao from './dao/MembersDao';
import { db } from './firebase';
import { checkLoggedIn } from './api';
import { PermissionsManager } from './permissions';
import { Member } from './DataTypes';
import { ErrorResponse, MemberResponse, AllMembersResponse } from './APITypes';

export const allMembers = async (
  req: Request,
  res: Response
): Promise<AllMembersResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const result = await MembersDao.getAllMembers();
    return {
      status: 200,
      members: result.members
    };
  }
  return undefined;
};

export const setMember = async (
  req: Request,
  res: Response
): Promise<MemberResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    const canEdit = PermissionsManager.canEditMembers(user.role);
    if (!canEdit) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to edit members!`
      };
    }
    if (!req.body.email || req.body.email === '') {
      return {
        status: 400,
        error: "Couldn't edit member with undefined email!"
      };
    }
    const result = await MembersDao.setMember(req.body.email, req.body);
    if (result.isSuccessful) {
      return { status: 200, member: result.member };
    }
    return { error: result.error!, status: 500 };
  }
  return undefined;
};

export const updateMember = async (
  req: Request,
  res: Response
): Promise<MemberResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    const canEdit = PermissionsManager.canEditMembers(user.role);
    if (!canEdit && user.email !== req.body.email) {
      // members are able to edit their own information
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to edit members!`
      };
    }
    if (!req.body.email || req.body.email === '') {
      return {
        status: 400,
        error: "Couldn't edit member with undefined email!"
      };
    }
    if (
      (req.body.role || req.body.first_name || req.body.last_name) &&
      !canEdit
    ) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to edit member name or roles!`
      };
    }
    const result = await MembersDao.updateMember(req.body.email, req.body);
    if (result.isSuccessful) {
      return { member: result.member, status: 200 };
    }
    return { status: 500, error: result.error! };
  }
  return undefined;
};

export const getMember = async (
  req: Request,
  res: Response
): Promise<MemberResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email:${req.session!.email}`
      };
    }
    const canEdit: boolean = PermissionsManager.canEditMembers(user.role);
    const memberEmail: string = req.params.email;
    if (!canEdit && memberEmail !== req.session!.email) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to get members!`
      };
    }
    const result = await MembersDao.getMember(memberEmail);
    if (!result.member) {
      return {
        status: 404,
        error: `Member with email: ${memberEmail} does not exist`
      };
    }
    return {
      member: result.member as Member,
      status: 200
    };
  }
  return undefined;
};

export const deleteMember = async (
  req: Request,
  res: Response
): Promise<MemberResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const user = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    if (!user) {
      return {
        status: 401,
        error: `No user with email: ${req.session!.email}`
      };
    }
    const canEdit = PermissionsManager.canEditMembers(user.role);
    if (!canEdit) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to delete members!`
      };
    }
    if (!req.body.email || req.body.email === '') {
      return {
        status: 400,
        error: "Couldn't delete member with undefined email!"
      };
    }
    const result = await MembersDao.deleteMember(req.body.email);
    if (result.isSuccessful) {
      return { member: result.member, status: 200 };
    }
    return { status: 500, error: result.error! };
  }
  return undefined;
};
