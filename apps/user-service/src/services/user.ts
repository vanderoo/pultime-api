import {IClass, ITeam, IUser, IUserService} from "../interfaces/user";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/api-error";

export class UserService implements IUserService{

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async delete(id: string): Promise<IUser> {
        const userToDelete = await this.prisma.user.findFirst({where: {id}});
        if (!userToDelete) {
            throw new ApiError(404, 'USER_NOT_FOUND', {id: `User with ID ${id} not found`});
        }
        await this.prisma.user.delete({where: {id}});
        return userToDelete;
    }

    async findById(id: string): Promise<IUser> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', { message: `User with ID ${id} not found` });
        }
        return user;
    }

    async listUserClasses(id: string): Promise<IClass[]> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { classes: { include: { course: true } } },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', { message: `User with ID ${id} not found` });
        }
        return user.classes.map((cls) => ({
            id: cls.id,
            className: cls.className,
            classCode: cls.classCode,
            courses: cls.course ? [{
                id: cls.course.id,
                courseName: cls.course.courseName,
                createdAt: cls.course.createdAt,
                updatedAt: cls.course.updatedAt,
            }] : [],
            createdAt: cls.createdAt,
            updatedAt: cls.updatedAt,
        }));
    }

    async listUserTeams(id: string): Promise<ITeam[]> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { teams: true },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', { message: `User with ID ${id} not found` });
        }
        return user.teams.map((team) => ({
            id: team.id,
            teamName: team.teamName,
            teamCode: team.teamCode,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        }));
    }

    async updateUsername(id: string, username: string): Promise<IUser> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', { message: `User with ID ${id} not found` });
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            throw new ApiError(400, 'USERNAME_ALREADY_EXISTS', { message: `Username ${username} is already taken` });
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { username },
        });
        return updatedUser;
    }
}