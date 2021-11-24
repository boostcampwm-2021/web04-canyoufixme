import express from 'express';
import { getAllProblemNum } from '../service/statisticService';

const router = express.Router();

router.get('/problems', getAllProblemNum);

export { router };
