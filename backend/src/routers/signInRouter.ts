import { Router } from 'express';
import {
  signInFormExists,
  signInFormExpired,
  createSignInForm,
  deleteSignInForm,
  signIn,
  allSignInForms,
  getSignInPrompt
} from '../API/signInFormAPI';
import { loginCheckedPost, loginCheckedGet } from '../utils/auth';

const signInRouter = Router();
loginCheckedPost(signInRouter, '/signInExists', async (req, _) => ({
  exists: await signInFormExists(req.body.id)
}));
loginCheckedPost(signInRouter, '/signInExpired', async (req, _) => ({
  expired: await signInFormExpired(req.body.id)
}));
loginCheckedPost(signInRouter, '/signInCreate', async (req, user) =>
  createSignInForm(req.body.id, req.body.expireAt, req.body.prompt, user)
);
loginCheckedPost(signInRouter, '/signInDelete', async (req, user) => {
  await deleteSignInForm(req.body.id, user);
  return {};
});
loginCheckedPost(signInRouter, '/signIn', async (req, user) =>
  signIn(req.body.id, req.body.response, user)
);
loginCheckedPost(signInRouter, '/signInAll', async (_, user) => allSignInForms(user));
loginCheckedGet(signInRouter, '/signInPrompt/:id', async (req, _) => ({
  prompt: await getSignInPrompt(req.params.id)
}));

export default signInRouter;
