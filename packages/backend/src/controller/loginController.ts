/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
import express from 'express';

import { isLogin, loginCallback } from '../service/loginService';

const router = express.Router();

router.get('/check', isLogin);
router.get('/callback', loginCallback);

export { router };
