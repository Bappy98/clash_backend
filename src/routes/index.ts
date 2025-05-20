import { Router } from "express";
import AuthRouter from './auth.js';
import password from './passwordRoute.js'

const router = Router();

router.use('/auth', AuthRouter);
router.use('/password',password)

export default router;