import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppErrors';

import auth from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, auth.jwt.secret);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('JWT token is invalid', 401);
  }
}
