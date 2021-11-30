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
router.get('/most-submits', mostSubmitProblems);
router.get('/most-corrects', mostCorrectProblems);
router.get('/most-wrongs', mostWrongProblems);

export { router };
