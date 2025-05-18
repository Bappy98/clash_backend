import { Router, Request, Response } from "express";
import { loginSchema, registrationSchema } from "../validation/authValidation.js";
import { ZodError } from "zod";
import { formatError } from "../helper.js";
import prisma from './../config/db.config.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

router.post("/login", async (req: Request, res: Response) => {
    try {
       const body = req.body;

       
        const payload = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        })
        if(!user){
            res.status(404).json({
                errors: {
                    email:"no user found in this email"
                }
            })
        }

        const compare = await bcrypt.compare(payload.password, user!.password);
        if(!compare){
            res.status(400).json({
                errors: {
                    password:"password does not match"
                }
            })
        }
        const jwtpayload = {
            id:user?.id,
            name:user?.name,
            email:user?.email
        }
        const token = jwt.sign(jwtpayload, process.env.SECRET_KEY!, {
            expiresIn: '1d'
        })

        res.status(200).json({
            message: 'Login successful',
            data: {
                ...jwtpayload,
                token:`Bearer ${token}`
            }
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