import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';

import uploadConfig from '../config/upload';
import UpdateUserAvatar from '../services/UpdateUserAvatar';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(uploadConfig);

const userRouter = Router();

userRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const userService = new CreateUserService();

  const user = await userService.execute({ name, email, password });

  return res.json(user);
});

userRouter.patch(
  '/avatar',
  upload.single('avatar'),
  ensureAuthenticated,
  async (req, res) => {
    const avatarService = new UpdateUserAvatar();

    const user = await avatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  },
);

export default userRouter;
