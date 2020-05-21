import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const sessionService = new CreateSessionService();

  const { user, token } = await sessionService.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionRouter;
