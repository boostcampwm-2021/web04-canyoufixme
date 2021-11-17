import express from 'express';
import { saveSubmit } from '../service/submitService';
import { isLogin } from '../service/loginService';

const router = express.Router();

router.post('/', isLogin, saveSubmit);

export { router };
