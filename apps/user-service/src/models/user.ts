import {User, Prisma } from "../database/generated-prisma-client";

type UserWithClasses = Prisma.UserGetPayload<{
    include: {
        classes: { include: { courses: true } };
    };
}>

type UserWithTeams = Prisma.UserGetPayload<{
    include: {
        teams: true;
    };
}>

export type UpdateUserRequest = {
    username: string;
}

export type UserResponse = {
    id: string;
    email: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}

export function toUserResponse(user: User) {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.createdAt,
        updated_at: user.updatedAt
    }
}

type ClassCourses = {
    id: string;
    course_name: string;
    created_at: Date;
    updated_at: Date;
}

export type UserClassesResponse = {
    id: string;
    class_name: string;
    class_code: string;
    courses: ClassCourses[];
    created_at: Date;
    updated_at: Date;
}

export function toUserClassesResponse(user: UserWithClasses) {
    return user.classes.map((classItem) => {
        return {
            id: classItem.id,
            class_name: classItem.className,
            class_code: classItem.classCode,
            courses: classItem.courses.map((course) => ({
                id: course.id,
                course_name: course.courseName,
                created_at: course.createdAt,
                updated_at: course.updatedAt
            })),
            created_at: classItem.createdAt,
            updated_at: classItem.updatedAt
        }
    });
}

export type UserTeamsResponse = {
    id: string;
    team_name: string;
    team_code: string;
    created_at: Date;
    updated_at: Date;
}

export function toUserTeamsResponse(user: UserWithTeams) {
    if (!user.teams) {
        return [];
    }
    return user.teams.map((team) => {
        return {
            id: team.id,
            team_name: team.teamName,
            team_code: team.teamCode,
            created_at: team.createdAt,
            updated_at: team.updatedAt
        }
    });
}


