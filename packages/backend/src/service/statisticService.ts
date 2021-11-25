/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { Problem } from '../model/Problem';
import { SubmitLog } from '../model/SubmitLog';
import { User } from '../model/User';

const getAllProblemNum = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json(problems.length);
  } catch (err) {
    res.status(500).json({
      message: 'can not get problem num',
      error: err.message,
    });
  }
};

const getAllSubmitNum = async (req: express.Request, res: express.Response) => {
  try {
    const submits = await SubmitLog.find({});
    res.status(200).json(submits.length);
  } catch (err) {
    res.status(500).json({
      message: 'can not get submit num',
      error: err.message,
    });
  }
};
const getUserCount = async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users.length);
  } catch (err) {
    res.status(500).json({
      message: 'can not get user num',
      error: err.message,
    });
  }
};
export { getAllProblemNum, getAllSubmitNum, getUserCount };
