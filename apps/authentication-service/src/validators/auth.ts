import { z } from 'zod';

export const signupValidator = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .min(1, 'Username is required')
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .min(1, 'Password is required')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and a special character'),
    confirm_password: z.string()
        .min(8, 'Confirm password must be at least 8 characters')
        .min(1, 'Confirm password is required')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).*$/, 'Confirm password must contain at least one uppercase letter, one lowercase letter, and a special character'),
});

export const loginValidator = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const logoutValidator = z.object({
    refresh_token: z.string().min(1, 'Refresh token is required'),
});

export const refreshTokenValidator = z.object({
    refresh_token: z.string().min(1, 'Refresh token is required'),
});

export const emailSentValidator = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
});

export const resetPasswordValidator = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and a special character'),
    confirm_password: z.string()
        .min(8, 'Confirm password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).*$/, 'Confirm password must contain at least one uppercase letter, one lowercase letter, and a special character'),
});

