import { Router } from "express";
import AuthRouter from './auth.js';

const router = Router();

router.use('/auth', AuthRouter);

export default router;