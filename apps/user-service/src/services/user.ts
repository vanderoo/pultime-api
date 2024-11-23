import {IClass, ITeam, IUser, IUserService} from "../interfaces/user";
import {PrismaClient} from "@prisma/client";
import {ApiError} from "../utils/api-error";

export class UserService implements IUserService{

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async delete(id: string): Promise<IUser> {
        const userToDelete = await this.prisma.user.findFirst({where: {id}});
        if (!userToDelete) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${id} not found` }]);
        }
        await this.prisma.user.delete({where: {id}});
        return userToDelete;
    }

    async findById(id: string): Promise<IUser> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${id} not found` }]);
        }
        return user;
    }

    async listUserClasses(id: string): Promise<IClass[]> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { classes: { include: { courses: true } } },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${id} not found` }]);
        }

        return user.classes
    }

    async listUserTeams(id: string): Promise<ITeam[]> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { teams: true },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${id} not found` }]);
        }
        return user.teams
    }

    async updateUsername(id: string, username: string): Promise<IUser> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${id} not found` }]);
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            throw new ApiError(400, 'USERNAME_ALREADY_EXISTS', [{ message: `Username ${username} is already taken` }]);
        }
        return this.prisma.user.update({
            where: {id},
            data: {username},
        });
    }
}