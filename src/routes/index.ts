import { Router } from "express";
import AuthRouter from './auth.js';
import password from './passwordRoute.js'
import  clash from './clash.js'

const router = Router();

router.use('/auth', AuthRouter);
router.use('/password',password)
router.use('/clash',clash)

export default router;