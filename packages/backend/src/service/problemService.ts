/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { Problem } from '../model/Problem';
import { ProblemCodeModel } from '../../settings/mongoConfig';

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
