/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../model/User';

const getAccessToken = async authorizationToken => {
  const url = new URL('https://github.com/login/oauth/access_token');
  const response = await axios.post(
    url.toString(),
    {
      client_id: process.env.GITHUB_CLIENT,
      client_secret: process.env.GITHUB_SECRET,
      code: authorizationToken,
    },
    {
      headers: { Accept: 'application/json' },
    },
  );

  return response.data.access_token;
};

const getUserInfo = async accessToken => {
  const { data: userInfo } = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `token ${accessToken}` },
  });
  return userInfo;
};

export const loginCallback = async (req: Request, res: Response) => {
  const authorizationToken = req.query.code;
  const accessToken = await getAccessToken(authorizationToken);
  const userInfo = await getUserInfo(accessToken);
  const user = await User.findOne({ name: userInfo.login });

  if (!user) {
    const newUser = new User();
    newUser.name = userInfo.login;
    newUser.oauthType = 'Github';
    newUser.token = accessToken;
    await newUser.save();
  }

  req.session['name'] = userInfo.login;
  req.session.save();
  res.cookie('isLogin', true);
  res.cookie('cyfm/SSS', req.session.id, { httpOnly: true });
  res.redirect(`${process.env.ORIGIN_URL}`);
};

export const isLogin = (req: Request, res: Response, next) => {
  if (req.cookies['cyfm/SSS']) {
    next();
  } else {
    res.status(401);
    res.json({
      status: 'Unauthorized',
      message: '로그인 필요.',
    });
  }
};
