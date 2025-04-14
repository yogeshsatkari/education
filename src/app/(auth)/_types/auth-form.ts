import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .refine((val) => val.length > 0, { message: "Name cannot be empty" }),

  username: z.string().optional(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(2)
    .max(50),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});

export const signInFormSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Username is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignUpForm = z.infer<typeof formSchema>;
