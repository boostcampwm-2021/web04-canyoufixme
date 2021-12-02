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
router.get('/problems/count', getAllProblemNum);
router.get('/submits/count', getAllSubmitNum);
router.get('/users/count', getUserCount);
router.get('/submits/most', mostSubmitProblems);
router.get('/corrects/most', mostCorrectProblems);
router.get('/wrongs/most', mostWrongProblems);

export { router };
