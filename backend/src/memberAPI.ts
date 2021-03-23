import { Request } from 'express';
import MembersDao from './dao/MembersDao';
import { db } from './firebase';
import { PermissionsManager } from './permissions';
import { Member } from './DataTypes';
import { ErrorResponse, MemberResponse, AllMembersResponse } from './APITypes';

export const allMembers = async (): Promise<AllMembersResponse> => {
  const result = await MembersDao.getAllMembers();
  return { status: 200, members: result.members };
};

export const setMember = async (
  req: Request
): Promise<MemberResponse | ErrorResponse> => {
  const user = (
    await db.doc(`members/${req.session!.email}`).get()
  ).data() as Member;
  if (!user) {
    return {
      status: 401,
      error: `No user with email: ${req.session!.email}`
    };
  }
  const canEdit = await PermissionsManager.canEditMembers(user);
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
};

export const updateMember = async (
  req: Request
): Promise<MemberResponse | ErrorResponse> => {
  const user = (
    await db.doc(`members/${req.session!.email}`).get()
  ).data() as Member;
  if (!user) {
    return {
      status: 401,
      error: `No user with email: ${req.session!.email}`
    };
  }
  const canEdit = await PermissionsManager.canEditMembers(user);
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
  const member = (await db.doc(`members/${req.body!.email}`).get()).data();
  if (!member) {
    return {
      status: 404,
      error: `No member with email: ${req.body!.email}`
    };
  }
  if (
    !canEdit &&
    (req.body.role !== member.role ||
      req.body.first_name !== member.first_name ||
      req.body.last_name !== member.last_name)
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
};

export const getMember = async (
  req: Request
): Promise<MemberResponse | ErrorResponse> => {
  const user = (
    await db.doc(`members/${req.session!.email}`).get()
  ).data() as Member;
  if (!user) {
    return {
      status: 401,
      error: `No user with email:${req.session!.email}`
    };
  }
  const canEdit: boolean = await PermissionsManager.canEditMembers(user);
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
};

export const deleteMember = async (
  req: Request
): Promise<MemberResponse | ErrorResponse> => {
  const user = (
    await db.doc(`members/${req.session!.email}`).get()
  ).data() as Member;
  if (!user) {
    return {
      status: 401,
      error: `No user with email: ${req.session!.email}`
    };
  }
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    return {
      status: 403,
      error: `User with email: ${
        req.session!.email
      } does not have permission to delete members!`
    };
  }
  const { email } = req.params;
  if (!email || email === '') {
    return {
      status: 400,
      error: "Couldn't delete member with undefined email!"
    };
  }
  const result = await MembersDao.deleteMember(email);
  if (result.isSuccessful) {
    return { member: result.member, status: 200 };
  }
  return { status: 500, error: result.error! };
};
