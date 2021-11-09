import express from 'express';
import { getList } from '../service/problemService';

const router = express.Router();

router.get('/list', getList);

export { router };
