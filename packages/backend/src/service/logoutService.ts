/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Request, Response } from 'express';
import { ResultCode } from '@cyfm/types';
import { commonCookieOptions } from '../util/common';

export const logout = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ message: ResultCode.fail, error: err });
    }
    res.clearCookie('isLogin', commonCookieOptions);
    res.clearCookie('connect.sid', {
      ...commonCookieOptions,
      httpOnly: true,
    });
    res.status(200).json({ message: ResultCode.success });
  });
};
