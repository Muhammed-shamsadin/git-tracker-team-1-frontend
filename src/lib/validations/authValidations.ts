import { z } from "zod";

const signupSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(6, { message: "Please provide your full name." }),
    email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address." }),
    password: z
        .string()
        .min(8, {
            message: "Your password must be at least 8 characters long.",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number.",
        })
        .regex(/[@$!%*?&#]/, {
            message: "Password must contain at least one special character.",
        }),
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, {
        message: "Your password must be at least 8 characters long.",
    }),
    remember: z.boolean().optional(),
});

export { signupSchema, loginSchema };
