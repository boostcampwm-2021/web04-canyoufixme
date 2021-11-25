import express from 'express';

import { findProblemById } from '../service/problemCodeService';

const router = express.Router();

router.get('/:id', findProblemById);

export { router };
