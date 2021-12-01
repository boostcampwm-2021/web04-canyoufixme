/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../model/User';
import { COOKIE_MAX_AGE } from '../util/constant';
import { commonCookieOptions } from '../util/common';

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

const saveUser = async (name: string, accessToken: string) => {
  const newUser = new User();
  newUser.name = name;
  newUser.oauthType = 'Github';
  newUser.token = accessToken;
  await newUser.save();
};

export const loginCallback = async (req: Request, res: Response) => {
  const authorizationToken = req.query.code;
  const accessToken = await getAccessToken(authorizationToken);
  const userInfo = await getUserInfo(accessToken);
  const user = await User.findOne({ name: userInfo.login });

  if (!user) {
    saveUser(userInfo.login, accessToken);
  }

  req.session['name'] = userInfo.login;
  req.session.save();
  res.cookie('isLogin', true, {
    ...commonCookieOptions,
    maxAge: COOKIE_MAX_AGE,
  });
  res.redirect(`${process.env.ORIGIN_URL}`);
};
