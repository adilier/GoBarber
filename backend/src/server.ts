import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppErrors';

import './database';

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      state: 'error',
      message: err.message,
    });
  }

  return res
    .status(500)
    .json({ status: 'error', message: 'internal server error' });
});

app.listen(3333, () => {
  console.log('🎉 Server started on port 3333!🎉');
});
