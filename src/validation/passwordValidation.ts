import e from 'express'
import {z} from 'zod'

export const forgetPasswordSchema = z.object({
    email:z.string({message:"Email is required"}).email({message:"Email must ba a correct email"})
})

export const resetPasswordSchema = z.object({
    email:z.string({message:"Email is required"}).email({message:"Email must ba a correct email"}),
    token:z.string({message:"Token is required"}),
    password:z.string({message:"Password is required"}).min(6).max(20),
    confirmPassword:z.string({message:"Confirm password is required"}).min(6).max(20)
}).refine((data)=> data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})