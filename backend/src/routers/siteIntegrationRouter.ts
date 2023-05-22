import { Router } from 'express';
import {
  requestIDOLPullDispatch,
  getIDOLChangesPR,
  acceptIDOLChanges,
  rejectIDOLChanges
} from '../API/siteIntegrationAPI';
import { loginCheckedPost, loginCheckedGet } from '../utils/auth';

const siteIntegrationRouter = Router();

loginCheckedPost(siteIntegrationRouter, '/pullIDOLChanges', (_, user) =>
  requestIDOLPullDispatch(user)
);

loginCheckedGet(siteIntegrationRouter, '/getIDOLChangesPR', (_, user) => getIDOLChangesPR(user));

loginCheckedPost(siteIntegrationRouter, '/acceptIDOLChanges', (_, user) => acceptIDOLChanges(user));

loginCheckedPost(siteIntegrationRouter, '/rejectIDOLChanges', (_, user) => rejectIDOLChanges(user));

export default siteIntegrationRouter;
