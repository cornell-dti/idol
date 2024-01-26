import { Router } from 'express';
import {
  loginCheckedDelete,
  loginCheckedGet,
  loginCheckedPost,
  loginCheckedPut
} from '../utils/auth';
import {
  createNewCandidateDeciderInstance,
  deleteCandidateDeciderInstance,
  getAllCandidateDeciderInstances,
  getCandidateDeciderInstance,
  toggleCandidateDeciderInstance,
  updateCandidateDeciderComment,
  updateCandidateDeciderRating
} from '../API/candidateDeciderAPI';

const candidateDeciderRouter = Router();

// I think the flexibility of `userHasAccess` param for the auth middleware
// make it so that the auth doesn't have to be handled by the API router handler
// anymore. I just don't wanna do it.

loginCheckedGet(candidateDeciderRouter, '/', async (_, user) => ({
  instances: await getAllCandidateDeciderInstances(user)
}));
loginCheckedGet(candidateDeciderRouter, '/:uuid', async (req, user) => ({
  instance: await getCandidateDeciderInstance(req.params.uuid, user)
}));
loginCheckedPost(candidateDeciderRouter, '/', async (req, user) => ({
  instance: await createNewCandidateDeciderInstance(req.body, user)
}));
loginCheckedPut(candidateDeciderRouter, '/:uuid', async (req, user) =>
  toggleCandidateDeciderInstance(req.params.uuid, user).then(() => ({}))
);
loginCheckedDelete(candidateDeciderRouter, '/:uuid', async (req, user) =>
  deleteCandidateDeciderInstance(req.params.uuid, user).then(() => ({}))
);
loginCheckedPut(candidateDeciderRouter, '/:uuid/rating', (req, user) =>
  updateCandidateDeciderRating(user, req.params.uuid, req.body.id, req.body.rating).then(() => ({}))
);
loginCheckedPost(candidateDeciderRouter, '/:uuid/comment', (req, user) =>
  updateCandidateDeciderComment(user, req.params.uuid, req.body.id, req.body.comment).then(
    () => ({})
  )
);

export default candidateDeciderRouter;
