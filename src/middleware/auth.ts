import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import { SECRET_KEY } from '../secrets/jwtSecretKey';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      //ToDo: make it to a base error :)
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    (req as CustomRequest).token = decoded.id;
    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};
