/* eslint-disable prefer-destructuring */
import express from 'express';
import { ProblemCodeModel } from '../settings/mongoConfig';

const findProblemById = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const problemCode = await ProblemCodeModel.findOne({ _id: id });
  return res.json(problemCode);
};

export { findProblemById };
