import { IClassService } from "../interfaces/class";
import { PrismaClient } from "../database/generated-prisma-client";
import {
    ClassAddUserRequest,
    ClassRequest,
    ClassResponse,
    ClassUpdateRequest,
    ClassUsersResponse, toClassResponse, toClassUsersResponse
} from "../models/class";
import { ApiError } from "@libs/shared";
import { v4 as uuidv4 } from "uuid";

export class ClassService implements IClassService {

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async addUser(request: ClassAddUserRequest): Promise<ClassUsersResponse[]> {
        const { class_code, user_id } = request;

        const [classData, userExists] = await Promise.all([
            this.prisma.class.findUnique({
                where: { classCode: class_code },
                include: { users: true },
            }),
            this.prisma.user.findUnique({ where: { id: user_id } }),
        ]);

        if (!classData) {
            throw new ApiError(404, 'CLASS_NOT_FOUND', [
                { message: `Class with code ${class_code} not found` }
            ]);
        }

        if (!userExists) {
            throw new ApiError(404, 'USER_NOT_FOUND', [
                { message: `User with id ${user_id} not found` }
            ]);
        }

        if (classData.users.some(user => user.id === user_id)) {
            throw new ApiError(400, 'USER_ALREADY_EXISTS', [
                { message: `User is already a member of this class` }
            ]);
        }

        const updatedClass = await this.prisma.class.update({
            where: { id: classData.id },
            data: {
                users: { connect: { id: userExists.id } },
            },
            include: { users: true },
        });

        return toClassUsersResponse(updatedClass);
    }

    async create(request: ClassRequest): Promise<ClassResponse> {
        const { class_name, courses } = request;

        const classCode = uuidv4().slice(0,8);

        const newClass = await this.prisma.class.create({
            data: {
                className: class_name,
                classCode: classCode,
                courses: {
                    createMany: {
                        data: courses.map(course => ({
                            courseName: course.course_name,
                        })),
                    },
                },
            },
            include: {
                courses: true,
            },
        });

        return toClassResponse(newClass);
    }

    async delete(classId: string): Promise<Record<string, any>> {
        const classToDelete = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classToDelete) {
            throw new ApiError(404, 'CLASS_NOT_FOUND', [
                { message: `Class with id ${classId} not found` }
            ]);
        }

        await this.prisma.class.delete({
            where: { id: classId },
        });

        return { message: 'Class successfully deleted' };
    }

    async deleteUser(classId: string, userId: string): Promise<ClassUsersResponse[]> {
        const [classData, userExists] = await Promise.all([
            this.prisma.class.findUnique({
                where: { id: classId },
                include: { users: true },
            }),
            this.prisma.user.findUnique({ where: { id: userId } }),
        ]);

        if (!classData) {
            throw new ApiError(404, 'CLASS_NOT_FOUND', [
                { message: `Class with id ${classId} not found` }
            ]);
        }

        if (!userExists) {
            throw new ApiError(404, 'USER_NOT_FOUND', [
                { message: `User with id ${userId} not found` }
            ]);
        }

        if (!classData.users.some(user => user.id === userId)) {
            throw new ApiError(404, 'USER_NOT_FOUND', [
                { message: `User not found in this class` }
            ]);
        }

        const updatedClass = await this.prisma.class.update({
            where: { id: classData.id },
            data: {
                users: { disconnect: { id: userExists.id } },
            },
            include: { users: true },
        });

        return toClassUsersResponse(updatedClass)
    }

    async findById(classId: string): Promise<ClassResponse> {
        const classData = await this.prisma.class.findUnique({
            where: { id: classId },
            include: { courses: true },
        });

        if (!classData) {
            throw new ApiError(404, 'CLASS_NOT_FOUND', [
                { message: `Class with id ${classId} not found` }
            ]);
        }

        return toClassResponse(classData);
    }

    async listUsers(classId: string): Promise<ClassUsersResponse[]> {
        const classData = await this.prisma.class.findUnique({
            where: { id: classId },
            include: { users: true },
        });

        if (!classData) {
            throw new ApiError(404, 'CLASS_NOT_FOUND', [
                { message: `Class with id ${classId} not found` }
            ]);
        }

        return toClassUsersResponse(classData)
    }

    async update(request: ClassUpdateRequest): Promise<ClassResponse> {
        const { id, class_name, courses } = request;

        const classData = await this.prisma.class.findUnique({
            where: { id },
            include: { courses: true },
        });

        if (!classData) {
            throw new ApiError(404, 'CLASS_NOT_FOUND', [
                {message: `Class with id ${id} not found`}
            ]);
        }

        const updatedCourses = courses?.map(course => ({
            id: course.course_id,
            courseName: course.course_name,
        })) || [];

        const courseOperations = updatedCourses.length > 0 ? {
            courses: {
                deleteMany: {
                    NOT: {
                        id: {
                            in: updatedCourses.map(course => course.id)
                        }
                    }
                },
                createMany: {
                    data: updatedCourses.filter(course => !course.id),
                },
                updateMany: updatedCourses.filter(course => course.id).map(course => ({
                    where: {
                        id: course.id,  // Use the primary key 'id' for updates
                    },
                    data: {
                        courseName: course.courseName,
                    },
                })),
            }
        } : {};

        const updatedClass = await this.prisma.class.update({
            where: { id },
            data: {
                className: class_name || classData.className,
                ...courseOperations
            },
            include: { courses: true },
        });

        return toClassResponse(updatedClass);
    }
}