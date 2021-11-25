/* eslint-disable import/namespace */
import express from 'express';
import { getAllProblemNum, getAllSubmitNum } from '../service/statisticService';

const router = express.Router();

router.get('/problems', getAllProblemNum);
router.get('/submits', getAllSubmitNum);

export { router };
