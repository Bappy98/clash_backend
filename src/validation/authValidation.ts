import {z} from "zod";

export const registrationSchema = z.object({
    name: z.string({message: "Name is required"}).min(3, {message: "Name must be at least 3 characters long"}).max(20, {message: "Name must be at most 20 characters long"}),
    email: z.string({message: "Email is required"}).email({message: "Invalid email format"}),
    password: z.string({message: "Password is required"}).min(6).max(20),
    confirmPassword: z.string({message: "Confirm password is required"}).min(6).max(20),
}).refine((data)=> data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});