import bcrypt from "bcrypt";

import { Secret } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { IAuthService, IToken, IUser } from "../interfaces/auth";
import { ApiError } from "../utils/api-error";
import * as process from "node:process";
import {generateToken, validateToken} from "../utils/token";
import * as console from "node:console";

export class AuthService implements IAuthService {

    private prisma: PrismaClient;
    private readonly JWT_SECRET: Secret;
    private readonly REFRESH_JWT_SECRET: Secret;
    private readonly JWT_KEY: string;

    constructor(prisma: PrismaClient) {
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
        this.JWT_KEY = process.env.JWT_KEY;
        this.prisma = prisma;
    }

    async register(email: string, username: string, password: string, confirmPassword: string): Promise<IUser> {
        if (password !== confirmPassword) {
            throw new ApiError(400, 'BAD_REQUEST', { field: 'Password do not match' });
        }

        const existingEmail = await this.prisma.user.findFirst({where: { email }});
        if (existingEmail) {
            throw new ApiError(400, 'BAD_REQUEST', { field: 'Email is already taken' });
        }

        const existingUsername = await this.prisma.user.findFirst({where: { username }});
        if (existingUsername) {
            throw new ApiError(400, 'BAD_REQUEST', { field: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword
            }
        });

        delete newUser.password;

        return newUser;
    }
    async login(username: string, password: string): Promise<IToken> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApiError(401, 'UNAUTHORIZED', { field: 'Invalid username or password' });
        }

        const accessToken = await generateToken({ "id": user.id, "username": user.username, "iss": this.JWT_KEY }, this.JWT_SECRET, "1h");

        const refreshToken = await generateToken({ 'id': user.id, 'username': user.username }, this.REFRESH_JWT_SECRET, "7d");

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const accessTokenExpires = new Date();
        accessTokenExpires.setHours(accessTokenExpires.getHours() + 1);

        await this.prisma.token.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: expiresAt,
            }
        });

        return {
            userId: user.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpires: accessTokenExpires
        };
    }
    async logout(token: string): Promise<void> {
        const refreshToken = await this.prisma.token.findFirst({where: { token }});
        if (!refreshToken) {
            throw new ApiError(404, 'NOT_FOUND', { token: 'Token Not Found' });
        }
        await this.prisma.token.delete({where: { token }});
    }
    async requestResetPassword(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async resetPassword(token: string, newPassword: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async refreshToken(refreshToken: string): Promise<IToken> {
        const storedToken = await this.prisma.token.findFirst({ where: { token: refreshToken } });
        if (!storedToken) {
            throw new ApiError(404, 'NOT_FOUND', { token: 'Token not found' });
        }

        const { valid, decoded, error } = await validateToken(refreshToken, this.REFRESH_JWT_SECRET);

        if (!valid) {
            throw new ApiError(401, 'UNAUTHORIZED', { token: error || 'Invalid refresh token' });
        }

        const userData = decoded as IUser;

        const newToken = await generateToken(
            { id: userData.id, username: userData.username, iss: this.JWT_KEY },
            this.JWT_SECRET,
            "1h"
        );

        const accessTokenExpires = new Date();
        accessTokenExpires.setHours(accessTokenExpires.getHours() + 1);

        return {
            userId: userData.id,
            accessToken: newToken,
            accessTokenExpires: accessTokenExpires
        };
    }
}