import { IUserService } from "../interfaces/user";
import { PrismaClient, User } from "../database/generated-prisma-client";
import { ApiError } from "@libs/shared";
import {
    toUserClassesResponse,
    toUserResponse,
    toUserTeamsResponse,
    UpdateUserRequest,
    UserClassesResponse,
    UserResponse,
    UserTeamsResponse
} from "../models/user";

export class UserService implements IUserService{

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async updateUsername(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const usernameExist = await this.prisma.user.findUnique({
            where: { username: request.username },
        });
        if (usernameExist) {
            throw new ApiError(400, 'USERNAME_ALREADY_EXISTS', [{
                message: `Username ${request.username} is already taken`
            }]);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: { username: request.username },
        });
        return toUserResponse(updatedUser);
    }

    async get(user: User): Promise<UserResponse> {
        const userToFind = await this.prisma.user.findUnique({
            where: { id: user.id },
        });
        if (!userToFind) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${user.id} not found` }]);
        }
        return toUserResponse(userToFind);
    }

    async listUserClasses(user: User): Promise<UserClassesResponse[]> {
        const userToFind = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { classes: { include: { courses: true } } },
        });
        if (!userToFind) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${user.id} not found` }]);
        }
        return toUserClassesResponse(userToFind);
    }

    async listUserTeams(user: User): Promise<UserTeamsResponse[]> {
        const userToFind = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { teams: true },
        });
        if (!userToFind) {
            throw new ApiError(404, 'USER_NOT_FOUND', [{ message: `User with ID ${user.id} not found` }]);
        }
        return toUserTeamsResponse(userToFind);
    }
}