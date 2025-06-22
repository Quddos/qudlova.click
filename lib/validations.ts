import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Invalid age"),
  gender: z.string().min(1, "Gender is required"),
  location: z.string().min(1, "Location is required"),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  lookingFor: z.string().min(1, "Please specify what you're looking for"),
  photos: z.array(z.string()).min(1, "At least one photo is required").max(6, "Maximum 6 photos allowed")
})

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
  receiverId: z.string().min(1, "Receiver ID is required")
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type MessageInput = z.infer<typeof messageSchema> 