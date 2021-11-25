/* eslint-disable import/namespace */
import express from 'express';
import {
  getAllProblemNum,
  getAllSubmitNum,
  getUserCount,
} from '../service/statisticService';

const router = express.Router();

router.get('/problems', getAllProblemNum);
router.get('/submits', getAllSubmitNum);
router.get('/users', getUserCount);

export { router };
