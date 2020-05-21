import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

import AppError from '../errors/AppErrors';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRespository = getRepository(User);

    const checkUserExists = await userRespository.findOne({ where: { email } });

    if (checkUserExists) {
      throw new AppError('Email address already used', 401);
    }

    const passwordHash = await hash(password, 8);

    if (password.length < 5) {
      throw new AppError('Short password', 401);
    }

    const user = userRespository.create({
      name,
      email,
      password: passwordHash,
    });

    await userRespository.save(user);

    return user;
  }
}

export default CreateUserService;
