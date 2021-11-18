/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Request, Response } from 'express';

export const logout = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ message: 'error', error: err });
    }
    res.clearCookie('isLogin');
    res.clearCookie('cyfm/SSS');
    res.clearCookie('connect.sid');
    res.json({ message: 'success' });
  });
};
