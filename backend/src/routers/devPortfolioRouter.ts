import { Router } from 'express';
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
const devPortfolioSubmissionRouter = Router({ mergeParams: true });
devPortfolioRouter.use('/:uuid/submission', devPortfolioSubmissionRouter);

// /dev-portfolio
loginCheckedGet(
  devPortfolioRouter,
  '/',
  async (req, user) => ({
    portfolios: !req.query.meta_only
      ? await getAllDevPortfolios(user)
      : await getAllDevPortfolioInfo()
  }),
  'dev-portfolio'
);
loginCheckedGet(
  devPortfolioRouter,
  '/:uuid',
  async (req, user) => ({
    portfolio: !req.query.meta_only
      ? await getDevPortfolio(req.params.uuid, user)
      : await getDevPortfolioInfo(req.params.uuid)
  }),
  'dev-portfolio'
);

loginCheckedPost(
  devPortfolioRouter,
  '/',
  async (req, user) => ({
    portfolio: await createNewDevPortfolio(req.body, user)
  }),
  'dev-portfolio'
);
loginCheckedDelete(
  devPortfolioRouter,
  '/:uuid',
  async (req, user) => deleteDevPortfolio(req.params.uuid, user).then(() => ({})),
  'dev-portfolio'
);

// devPortfolioSubmissionRouter: /dev-portfolio/:uuid/submission
loginCheckedPost(
  devPortfolioSubmissionRouter,
  '/',
  async (req, user) => {
    await DPSubmissionRequestLogDao.logRequest(user.email, req.body.uuid, req.body.submission);
    return {
      submission: await makeDevPortfolioSubmission(req.body.uuid, req.body.submission)
    };
  },
  'dev-portfolio-submission'
);
loginCheckedPut(
  devPortfolioSubmissionRouter,
  '/regrade',
  async (req, user) => ({
    portfolio: await regradeSubmissions(req.body.uuid, user)
  }),
  'dev-portfolio-submission'
);
loginCheckedPut(
  devPortfolioSubmissionRouter,
  '/',
  async (req, user) => ({
    portfolio: await updateSubmissions(req.params.uuid, req.body.updatedSubmissions, user)
  }),
  'dev-portfolio-submission'
);
loginCheckedGet(
  devPortfolioSubmissionRouter,
  '/:email',
  async (req, user) => ({
    submissions: await getUsersDevPortfolioSubmissions(req.params.uuid, user)
  }),
  'dev-portfolio-submission'
);

export default devPortfolioRouter;
