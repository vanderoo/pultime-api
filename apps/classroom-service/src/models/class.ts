import { Prisma } from "../database/generated-prisma-client";

type ClassWithCourses = Prisma.ClassGetPayload<{
    include: { courses: true };
}>

type ClassWithUsers = Prisma.ClassGetPayload<{
    include: { users: true };
}>

export type ClassRequest = {
    class_name: string;
    courses: {
        course_name: string;
    }[];
};

export type ClassUpdateRequest = {
    id: string;
    class_name?: string;
    courses?: {
        course_id?: string;
        course_name: string;
    }[];
};

export type ClassAddUserRequest = {
    class_code: string;
    user_id: string;
};

type ClassCourses = {
    id: string;
    course_name: string;
    created_at: Date;
    updated_at: Date;
}

export type ClassResponse = {
    id: string;
    class_name: string;
    class_code: string;
    courses: ClassCourses[];
    created_at: Date;
    updated_at: Date;
}

export function toClassResponse(classes: ClassWithCourses) {
    return {
        id: classes.id,
        class_name: classes.className,
        class_code: classes.classCode,
        courses: classes.courses.map(course => ({
            id: course.id,
            course_name: course.courseName,
            created_at: course.createdAt,
            updated_at: course.updatedAt,
        })),
        created_at: classes.createdAt,
        updated_at: classes.updatedAt
    }
}

export type ClassUsersResponse = {
    id: string;
    email: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}

export function toClassUsersResponse(classes: ClassWithUsers) {
    return classes.users.map((user) => {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        }
    });
}
