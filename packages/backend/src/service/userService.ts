import express from 'express';
import { User } from '../model/User';

const getUserByName = async name => {
  const user = await User.findOne({ name });
  return user;
};

const findUserByName = async (req: express.Request, res: express.Response) => {
  const {
    params: { name },
  } = req;
  const user = await getUserByName(name);
  if (!user) {
    return res.status(404).json({});
  }
  return res.json(user);
};

export { getUserByName, findUserByName };
