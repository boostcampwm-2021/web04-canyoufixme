import express from 'express';
import { logout } from '../service/logoutService';

const router = express.Router();

router.post('/', logout);

export { router };
