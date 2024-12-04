import { z } from "zod";

export const classCreateRequestValidator = z.object({
    class_name: z.string().min(1, "Class name is required"),
    courses: z.array(
        z.object({
            course_name: z.string().min(1, "Course name is required"),
        })
    ).nonempty("At least one course is required"),
});

export const classUpdateRequestValidator = z.object({
    class_name: z.string().optional(),
    courses: z.array(
        z.object({
            course_id: z.string().uuid("Invalid course ID format").optional(),
            course_name: z.string().min(1, "Course name is required"),
        })
    ).optional(),
});

export const classAddUserRequestValidator = z.object({
    user_id: z.string().uuid("Invalid user ID format"),
});
