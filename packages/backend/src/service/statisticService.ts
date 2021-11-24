/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { Problem } from '../model/Problem';

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

export { getAllProblemNum };
