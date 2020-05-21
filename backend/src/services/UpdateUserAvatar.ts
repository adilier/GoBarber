import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';

import AppError from '../errors/AppErrors';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatar {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const avatarRepository = getRepository(User);

    const user = await avatarRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can chance avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await avatarRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatar;
