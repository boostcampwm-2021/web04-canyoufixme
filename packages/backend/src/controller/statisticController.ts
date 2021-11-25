/* eslint-disable import/namespace */
import express from 'express';
import {
  getAllProblemNum,
  getAllSubmitNum,
  getUserCount,
  mostSubmitProblems,
  mostCorrectProblems,
  mostWrongProblems,
  getAllData,
} from '../service/statisticService';

const router = express.Router();

router.get('/', getAllData);
router.get('/problems', getAllProblemNum);
router.get('/submits', getAllSubmitNum);
router.get('/users', getUserCount);
router.get('/submit/top', mostSubmitProblems);
router.get('/submit/correct', mostCorrectProblems);
router.get('/submit/wrong', mostWrongProblems);

export { router };
