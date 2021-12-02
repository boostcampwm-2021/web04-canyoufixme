/* eslint-disable prefer-destructuring */
import express from 'express';
import { ProblemCodeModel } from '../setting/mongoConfig';

const findProblemCodeById = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = req.params.id;
  const problemCode = await ProblemCodeModel.findOne({ _id: id });
  return res.status(200).json(problemCode);
};

export { findProblemCodeById };
