import { checkLoggedIn } from './api';
import { allRoles } from './permissions';

export const getAllRoles = async (req: Request, res) => {
  if (checkLoggedIn(req, res)) {
    res.status(200).json({ roles: allRoles });
  }
};
