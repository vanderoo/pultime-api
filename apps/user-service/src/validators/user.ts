import { z } from "zod";

export const updateUsernameValidator = z.object({
    id: z.string().min(1, "User ID is required"),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .min(1, 'Username is required')
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export const userIdValidator = z.object({
    id: z.string().min(1, "User ID is required"),
});
