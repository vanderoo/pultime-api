import { z } from "zod";

export const updateUsernameValidator = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .min(1, 'Username is required')
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});