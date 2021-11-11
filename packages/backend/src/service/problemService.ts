/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { Problem } from '../model/Problem';
import { ProblemCodeModel } from '../../settings/mongoConfig';
import { User } from '../model/User';

const getList = async (req: express.Request, res: express.Response) => {
  const problems = await Problem.find({ relations: ['author'] });
  res.json(problems);
};

const saveCode = async (code, content, testCode) => {
  const problemCode = new ProblemCodeModel();
  problemCode.code = code;
  problemCode.content = content;
  problemCode.testCode = testCode;

  const codeData = await problemCode.save();
  return codeData;
};

const getCodeId = codeData => codeData['_id'].toString();

const saveProblem = async ({ title, category, level, author, codeId }) => {
  const problem = new Problem();
  problem.title = title;
  problem.category = category;
  problem.level = level;
  problem.author = author;
  problem.codeId = codeId;

  await problem.save();
};
