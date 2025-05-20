import e, { Router, Request, Response } from "express";
import  prisma  from "../config/db.config.js";
import { authLimiter } from "../config/rateLimit.js";
import { ZodError } from "zod";
import { checkDateHourDiff, formatError } from "../helper.js";
import { forgetPasswordSchema, resetPasswordSchema } from "../validation/passwordValidation.js";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

const router = Router();

router.post('/forget-password',authLimiter,async(req:Request,res:Response)=>{
    try {
        const body = req.body
        const payload = forgetPasswordSchema.parse(body)

        let user = await prisma.user.findUnique({
            where:{
                email:payload.email
            }
        })
        if(!user || user === null) {
             res.status(422).json({
                message:"Invalid data",errors:{
                    email:"no user found in this email"
                }
            })
        }

       const salt = await bcrypt.genSalt(10); 
       const token = await bcrypt.hash(uuidv4(),salt)

       await prisma.user.update({
        where:{
            email:payload.email
        },
        data:{
            password_reset_token:token,
            token_send_at:new Date().toISOString()
        }
       })

       const url = `${process.env.BASE_URL}/reset-password?email=${payload.email}&token=${token}`

       res.status(200).json({
        message:"Email sent successfully",
        url
       })
        
    } catch (error) {
        if(error instanceof ZodError) {
            const errors = formatError(error)
            res.status(422).json({
                message:"invalid Data",errors
            })
        }
        res.status(500).json({
            massage:"Internal server Error"
        })
    }
})

router.post('/reset-password',authLimiter,async(req:Request,res:Response)=>{
    try {
        const body = req.body
        const payload = resetPasswordSchema.parse(body)
        const user = await prisma.user.findUnique({
            where:{
                email:payload.email
            },
            select:{
                password_reset_token:true,
                token_send_at:true,
                email:true
            }
        })

        if(!user) {
            res.status(422).json({
                message:"Invalid data",errors:{
                    email:"no Account found in this email"
                }
            })
        }

        if(payload.token !== user?.password_reset_token) {
            res.status(422).json({
                errors:{
                    email:"Please enter a valid token"
                }
            })
        }
        const hoursDiff = checkDateHourDiff(user?.token_send_at as Date)
        if(hoursDiff > 2) {
            res.status(422).json({
                errors:{
                    email:"Token expired"
                }
            })
        }

    // update password

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(payload.password,salt)
    await prisma.user.update({
        where:{
            email:payload.email
        },
        data:{
            password,
            password_reset_token:null,
            token_send_at:null
        }
    })
    res.status(200).json({
        message:"Password updated successfully"
    })

    } catch (error) {
            if(error instanceof ZodError) {
                const errors = formatError(error)
                res.status(422).json({
                    message:"invalid Data",errors
                })
            }
            res.status(500).json({
                massage:"Internal server Error"
            })
        }
    })

export default router;