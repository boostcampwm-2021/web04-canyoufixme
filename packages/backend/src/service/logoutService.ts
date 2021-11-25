/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Request, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const origin = new URL(process.env.ORIGIN_URL);
const getDomainFromHostname = hostname =>
  hostname.split('.').slice(-2).join('.');

const commonCookieOptions = {
  domain: getDomainFromHostname(origin.hostname),
  secure: isProduction,
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ message: 'error', error: err });
    }
    res.clearCookie('isLogin', commonCookieOptions);
    res.clearCookie('connect.sid', {
      ...commonCookieOptions,
      httpOnly: true,
    });
    res.json({ message: 'success' });
  });
};
