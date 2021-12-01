/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { Problem } from '../model/Problem';
import { ProblemCodeModel } from '../setting/mongoConfig';
import { User } from '../model/User';
import { LOAD_FAIL, WRITE_SUCCESS, WRITE_FAIL } from '../util/constant';
import { getCodeId } from '../util/common';

const isNumberAndNatural = num => {
  return !Number.isNaN(num) && num > 0;
};

const getList = async (req: express.Request, res: express.Response) => {
  let skip = parseInt(req.query.offset as string, 10);
  let take = parseInt(req.query.limit as string, 10);

  take = isNumberAndNatural(take) ? take : 10;
  skip = isNumberAndNatural(take) && isNumberAndNatural(skip) ? skip : 0;

  try {
    const problems = await Problem.find({
      relations: ['author'],
      skip,
      take,
    });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({
      message: LOAD_FAIL,
      error: err.message,
    });
  }
};

const saveCode = async (code, content, testCode) => {
  const problemCode = new ProblemCodeModel();
  problemCode.code = code;
  problemCode.content = content;
  problemCode.testCode = testCode;

  const codeData = await problemCode.save();
  return codeData;
};

const saveProblem = async ({ title, category, level, author, codeId }) => {
  const problem = new Problem();
  problem.title = title;
  problem.category = category;
  problem.level = level;
  problem.author = author;
  problem.codeId = codeId;

  await problem.save();
};

const writeProblem = async (req: express.Request, res: express.Response) => {
  try {
    const author = await User.findOne({ name: req.session['name'] });
    const { code, content, testCode, title, category, level } = req.body;
    const codeData = await saveCode(code, content, testCode);
    const codeId = getCodeId(codeData);

    await saveProblem({ title, category, level, author, codeId });

    res.status(201).json({ message: WRITE_SUCCESS });
  } catch (err) {
    res.status(500).json({ message: WRITE_FAIL, error: err.message });
  }
};

export { getList, writeProblem };
