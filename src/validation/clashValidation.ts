import {z}  from "zod";

export const clashSchema = z.object({
    title:z.string({message:"Title is required"}).min(3, {message: "Title must be at least 3 characters long"}).max(50, {message: "Title must be at most 50 characters long"}),
    description:z.string().max(2000, {message: "Description must be at most 2000 characters long"}).optional(),
    expire_at:z.coerce.date({
  errorMap: () => ({ message: "Please enter a valid date" }),
}).refine((date) => date > new Date(), {
  message: "Expire date must be in the future",
}),
    image:z.string().optional()
})