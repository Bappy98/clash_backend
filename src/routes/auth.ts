import { Router, Request, Response } from "express";
import { registrationSchema } from "../validation/authValidation.js";
import { ZodError } from "zod";
import { formatError } from "../helper.js";
import prisma from './../config/db.config.js';
import bcrypt from 'bcrypt'

const router = Router();

router.post('/register',async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const payload = registrationSchema.parse(body);
       const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
       })
       if(user){
         res.status(400).json({
            message: 'User already exists'
        })
       }
       
       const salt = await bcrypt.genSalt(10);
       payload.password = await bcrypt.hash(payload.password, salt);

       const newUser = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: payload.password
            }
        })
        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        })
    } catch (error) {
        if(error instanceof ZodError){
            const errors = formatError(error)
            res.status(400).json({
                message: 'Validation Error',
                errors
            })

        }
         res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

export default router;