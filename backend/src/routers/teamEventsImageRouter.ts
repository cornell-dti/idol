import { Router } from 'express';
import { loginCheckedGet, loginCheckedDelete } from '../utils/auth';
import {
  getEventProofImage,
  setEventProofImage,
  deleteEventProofImage
} from '../API/teamEventsImageAPI';

const eventProofImageRouter = Router();

loginCheckedGet(eventProofImageRouter, '/:name(*)', async (req, user) => ({
  url: await getEventProofImage(req.params.name, user)
}));
loginCheckedGet(eventProofImageRouter, '/:name(*)/signed-url', async (req, user) => ({
  url: await setEventProofImage(req.params.name, user)
}));
loginCheckedDelete(eventProofImageRouter, '/:name', async (req, user) => {
  await deleteEventProofImage(req.params.name, user);
  return {};
});

export default eventProofImageRouter;
