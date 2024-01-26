import { Router, Request } from 'express';
import { getMemberImage, setMemberImage, allMemberImages } from '../API/imageAPI';
import { loginCheckedGet } from '../utils/auth';

const memberImageRouter = Router();

const canAccessResource = async (req: Request, user: IdolMember): Promise<boolean> =>
  req.params.email === user.email;

loginCheckedGet(
  memberImageRouter,
  '/:email',
  async (_, user) => ({
    url: await getMemberImage(user)
  }),
  'profile-image',
  'read',
  canAccessResource
);

loginCheckedGet(
  memberImageRouter,
  '/:email/signed-url',
  async (_, user) => ({
    url: await setMemberImage(user)
  }),
  'profile-image',
  'write',
  canAccessResource
);

memberImageRouter.get('/', async (_, res) => {
  const images = await allMemberImages();
  res.status(200).json({ images });
});

export default memberImageRouter;
