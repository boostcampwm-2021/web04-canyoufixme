import express from 'express';

import { writeProblem } from '../service/problemService';
import { findProblemCodeById } from '../service/problemCodeService';

import { isLogin } from '../middlewares/isLogin';

const router = express.Router();

router.get('/:id', findProblemCodeById);
router.post('/', isLogin, writeProblem);

export { router };
