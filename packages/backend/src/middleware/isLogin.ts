import { Request, Response } from 'express';
import { IS_NOT_LOGIN } from '../util/constant';

export const isLogin = (req: Request, res: Response, next) => {
  if (req.cookies['connect.sid']) {
    next();
  } else {
    res.status(401).json({
      message: IS_NOT_LOGIN,
    });
  }
};
