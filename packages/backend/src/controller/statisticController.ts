/* eslint-disable import/namespace */
import express from 'express';
import {
  getAllProblemNum,
  getAllSubmitNum,
  getUserCount,
  mostSubmitProblems,
  mostCorrectProblems,
} from '../service/statisticService';

const router = express.Router();

router.get('/problems', getAllProblemNum);
router.get('/submits', getAllSubmitNum);
router.get('/users', getUserCount);
router.get('/submit/top', mostSubmitProblems);
router.get('/submit/correct', mostCorrectProblems);

export { router };
