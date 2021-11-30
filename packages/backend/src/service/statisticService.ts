/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import express from 'express';
import { getRepository } from 'typeorm';
import { Problem } from '../model/Problem';
import { SubmitLog } from '../model/SubmitLog';
import { User } from '../model/User';

const getAllSomethingNum = async (something, key) => {
  const [_, resultCount] = await something.findAndCount({});
  return { [key]: resultCount };
};

const mostSomethingProblems = async (condition, key) => {
  let submitLogJoinData = getRepository(SubmitLog)
    .createQueryBuilder('submitlog')
    .select('COUNT(submitlog.problem)', 'count')
    .leftJoinAndSelect('submitlog.problem', 'problem');

  submitLogJoinData =
    condition === 'ALL'
      ? submitLogJoinData
      : condition === 'CORRECT'
      ? submitLogJoinData.where('submitlog.status = :status', {
          status: '맞았습니다!!!',
        })
      : submitLogJoinData.where('submitlog.status != :status', {
          status: '맞았습니다!!!',
        });

  const result = await submitLogJoinData
    .groupBy('submitlog.problem')
    .orderBy('count', 'DESC')
    .limit(5)
    .getRawMany();

  return { [key]: result };
};

const dataTransfer = preData => {
  const result = preData.reduce((pre, cur) => {
    return { ...pre, ...cur };
  }, {});
  return result;
};

const getAllData = async (req: express.Request, res: express.Response) => {
  try {
    const result = await Promise.all([
      getAllSomethingNum(Problem, 'problemCount'),
      getAllSomethingNum(SubmitLog, 'submitCount'),
      getAllSomethingNum(User, 'userCount'),
      mostSomethingProblems('ALL', 'mostSubmitProblems'),
      mostSomethingProblems('CORRECT', 'mostCorrectProblems'),
      mostSomethingProblems('WRONG', 'mostWrongProblems'),
    ]);
    const transferData = dataTransfer(result);
    res.status(200).json(transferData);
  } catch (err) {
    res.status(500).json({
      message: 'can not get all data',
      error: err.message,
    });
  }
};

const getAllProblemNum = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const problemLength = await getAllSomethingNum(Problem, 'problemCount');
    res.status(200).json(problemLength);
  } catch (err) {
    res.status(500).json({
      message: 'can not get problem num',
      error: err.message,
    });
  }
};

const getAllSubmitNum = async (req: express.Request, res: express.Response) => {
  try {
    const submitLogLength = await getAllSomethingNum(SubmitLog, 'submitCount');
    res.status(200).json(submitLogLength);
  } catch (err) {
    res.status(500).json({
      message: 'can not get submit num',
      error: err.message,
    });
  }
};
const getUserCount = async (req: express.Request, res: express.Response) => {
  try {
    const userLength = await getAllSomethingNum(User, 'userCount');
    res.status(200).json(userLength);
  } catch (err) {
    res.status(500).json({
      message: 'can not get user num',
      error: err.message,
    });
  }
};

const mostSubmitProblems = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const submitProblems = await mostSomethingProblems(
      'ALL',
      'mostSubmitProblems',
    );
    res.status(200).json(submitProblems);
  } catch (err) {
    res.status(500).json({
      message: 'can not get most submit problems',
      error: err.message,
    });
  }
};

const mostCorrectProblems = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const correctProblems = await mostSomethingProblems(
      'CORRECT',
      'mostCorrectProblems',
    );
    res.status(200).json(correctProblems);
  } catch (err) {
    res.status(500).json({
      message: 'can not get most correct problems',
      error: err.message,
    });
  }
};

const mostWrongProblems = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const wrongProblems = await mostSomethingProblems(
      'WRONG',
      'mostWrongProblems',
    );
    res.status(200).json(wrongProblems);
  } catch (err) {
    res.status(500).json({
      message: 'can not get most submit problems',
      error: err.message,
    });
  }
};

export {
  getAllData,
  getAllProblemNum,
  getAllSubmitNum,
  getUserCount,
  mostSubmitProblems,
  mostCorrectProblems,
  mostWrongProblems,
  getAllSomethingNum,
  mostSomethingProblems,
  dataTransfer,
};
