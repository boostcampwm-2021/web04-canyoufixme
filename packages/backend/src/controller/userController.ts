import express from 'express';
import { findUserByName } from '../service/userService';

const router = express.Router();
router.get('/:name', findUserByName);

export { router };
