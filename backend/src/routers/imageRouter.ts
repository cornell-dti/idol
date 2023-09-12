import { Router } from 'express';
import { getMemberImage, setMemberImage, allMemberImages } from '../API/imageAPI';
import { loginCheckedGet } from '../utils/auth';

const memberImageRouter = Router();

loginCheckedGet(
  memberImageRouter,
  '/:email',
  async (_, user) => ({
    url: await getMemberImage(user)
  }),
  'profile-image'
);

loginCheckedGet(
  memberImageRouter,
  '/:email/signed-url',
  async (_, user) => ({
    url: await setMemberImage(user)
  }),
  'profile-image'
);

memberImageRouter.get('/', async (_, res) => {
  const images = await allMemberImages();
  res.status(200).json({ images });
});

export default memberImageRouter;
