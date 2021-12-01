/* eslint-disable no-nested-ternary */
import express from 'express';
import { getRepository } from 'typeorm';
import { Problem } from '../model/Problem';
import { SubmitLog } from '../model/SubmitLog';
import { User } from '../model/User';
import {
  WRONG_ANSWER_MESSAGE,
  CORRECT_ANSWER_MESSAGE,
  GET_ALL_DATA_ERROR,
  CONDITION,
  GET_MOST_SUBMIT_PROBLEM_ERROR,
  GET_MOST_CORRECT_SUBMIT_PROBLEM_ERROR,
  GET_MOST_WRONG_SUBMIT_PROBLEM_ERROR,
  GET_PROBLEM_COUNT_ERROR,
  GET_SUBMIT_COUNT_ERROR,
  GET_USER_COUNT_ERROR,
} from '../util/constant';

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
    condition === CONDITION.ALL
      ? submitLogJoinData
      : condition === CONDITION.CORRECT
      ? submitLogJoinData.where('submitlog.status = :status', {
          status: CORRECT_ANSWER_MESSAGE,
        })
      : submitLogJoinData.where('submitlog.status != :status', {
          status: WRONG_ANSWER_MESSAGE,
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
      mostSomethingProblems(CONDITION.ALL, 'mostSubmitProblems'),
      mostSomethingProblems(CONDITION.CORRECT, 'mostCorrectProblems'),
      mostSomethingProblems(CONDITION.WRONG, 'mostWrongProblems'),
    ]);
    const transferData = dataTransfer(result);
    res.status(200).json(transferData);
  } catch (err) {
    res.status(500).json({
      message: GET_ALL_DATA_ERROR,
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
      message: GET_PROBLEM_COUNT_ERROR,
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
      message: GET_SUBMIT_COUNT_ERROR,
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
      message: GET_USER_COUNT_ERROR,
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
      CONDITION.ALL,
      'mostSubmitProblems',
    );
    res.status(200).json(submitProblems);
  } catch (err) {
    res.status(500).json({
      message: GET_MOST_SUBMIT_PROBLEM_ERROR,
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
      CONDITION.CORRECT,
      'mostCorrectProblems',
    );
    res.status(200).json(correctProblems);
  } catch (err) {
    res.status(500).json({
      message: GET_MOST_CORRECT_SUBMIT_PROBLEM_ERROR,
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
      CONDITION.WRONG,
      'mostWrongProblems',
    );
    res.status(200).json(wrongProblems);
  } catch (err) {
    res.status(500).json({
      message: GET_MOST_WRONG_SUBMIT_PROBLEM_ERROR,
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
