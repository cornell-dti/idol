import { Router } from 'express';
import {
  allApprovedMembers,
  allMembers,
  setMember,
  deleteMember,
  updateMember,
  getUserInformationDifference,
  reviewUserInformationChange
} from '../API/memberAPI';
import MembersDao from '../dao/MembersDao';
import {
  loginCheckedPost,
  loginCheckedDelete,
  loginCheckedPut,
  loginCheckedGet
} from '../utils/auth';

export const memberRouter = Router();
export const memberDiffRouter = Router();

memberRouter.get('/', async (req, res) => {
  const type = req.query.type as string | undefined;
  let members;
  switch (type) {
    case 'all-semesters':
      members = await MembersDao.getMembersFromAllSemesters();
      break;
    case 'approved':
      members = await allApprovedMembers();
      break;
    default:
      members = await allMembers();
  }
  res.status(200).json({ members });
});

loginCheckedPost(
  memberRouter,
  '/:email',
  async (req, user) => ({
    member: await setMember(req.body, user)
  }),
  'member'
);
loginCheckedDelete(
  memberRouter,
  '/:email',
  async (req, user) => {
    await deleteMember(req.params.email, user);
    return {};
  },
  'member'
);
loginCheckedPut(
  memberRouter,
  '/:email',
  async (req, user) => ({
    member: await updateMember(req, req.body, user)
  }),
  'member'
);

loginCheckedGet(
  memberDiffRouter,
  '/',
  async (_, user) => ({
    diffs: await getUserInformationDifference(user)
  }),
  'member-diff'
);
loginCheckedPut(
  memberDiffRouter,
  '/',
  async (req, user) => ({
    member: await reviewUserInformationChange(req.body.approved, req.body.rejected, user)
  }),
  'member-diff'
);
