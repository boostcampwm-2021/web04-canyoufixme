import express from 'express';
import { Problem } from '../model/Problem';

const getList = async (req: express.Request, res: express.Response) => {
  const problems = await Problem.find({ relations: ['author'] });
  return res.json(problems);
};

export { getList };
