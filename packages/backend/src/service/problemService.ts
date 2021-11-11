/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { Problem } from '../model/Problem';

const getList = async (req: express.Request, res: express.Response) => {
  const problems = await Problem.find({ relations: ['author'] });
  res.json(problems);
};

export { getList };
