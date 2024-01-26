import { Router, Request } from 'express';
import {
  loginCheckedDelete,
  loginCheckedGet,
  loginCheckedPost,
  loginCheckedPut
} from '../utils/auth';
import {
  getAllDevPortfolios,
  getAllDevPortfolioInfo,
  getDevPortfolio,
  getDevPortfolioInfo,
  createNewDevPortfolio,
  deleteDevPortfolio,
  makeDevPortfolioSubmission,
  regradeSubmissions,
  updateSubmissions,
  getUsersDevPortfolioSubmissions
} from '../API/devPortfolioAPI';
import DPSubmissionRequestLogDao from '../dao/DPSubmissionRequestLogDao';

const devPortfolioRouter = Router();

const userCanAccessResource = async (req: Request, user: IdolMember): Promise<boolean> => {
  if (req.params.email === user.email) return true;
  if (req.query.meta_only) return true;
  return false;
};

// /dev-portfolio
loginCheckedGet(
  devPortfolioRouter,
  '/',
  async (req, user) => ({
    portfolios: !req.query.meta_only
      ? await getAllDevPortfolios(user)
      : await getAllDevPortfolioInfo()
  }),
  'dev-portfolio',
  'write',
  userCanAccessResource
);
loginCheckedGet(
  devPortfolioRouter,
  '/:uuid',
  async (req, user) => ({
    portfolio: !req.query.meta_only
      ? await getDevPortfolio(req.params.uuid, user)
      : await getDevPortfolioInfo(req.params.uuid)
  }),
  'dev-portfolio',
  'read',
  userCanAccessResource
);

loginCheckedPost(
  devPortfolioRouter,
  '/',
  async (req, user) => ({
    portfolio: await createNewDevPortfolio(req.body, user)
  }),
  'dev-portfolio',
  'write',
  userCanAccessResource
);
loginCheckedDelete(
  devPortfolioRouter,
  '/:uuid',
  async (req, user) => deleteDevPortfolio(req.params.uuid, user).then(() => ({})),
  'dev-portfolio',
  'write',
  userCanAccessResource
);

// devPortfolioSubmissionRouter: /dev-portfolio/:uuid/submission
loginCheckedPost(devPortfolioRouter, '/:uuid/submission', async (req, user) => {
  await DPSubmissionRequestLogDao.logRequest(user.email, req.body.uuid, req.body.submission);
  return {
    submission: await makeDevPortfolioSubmission(req.body.uuid, req.body.submission)
  };
});
loginCheckedPut(
  devPortfolioRouter,
  '/:uuid/submission/regrade',
  async (req, user) => ({
    portfolio: await regradeSubmissions(req.body.uuid, user)
  }),
  'dev-portfolio-submission',
  'write',
  async () => false
);
loginCheckedPut(
  devPortfolioRouter,
  '/:uuid/submission',
  async (req, user) => ({
    portfolio: await updateSubmissions(req.params.uuid, req.body.updatedSubmissions, user)
  }),
  'dev-portfolio-submission',
  'write',
  async () => false
);
loginCheckedGet(
  devPortfolioRouter,
  '/:uuid/submission/:email',
  async (req, user) => ({
    submissions: await getUsersDevPortfolioSubmissions(req.params.uuid, user)
  }),
  'dev-portfolio-submission',
  'read',
  userCanAccessResource
);

export default devPortfolioRouter;
