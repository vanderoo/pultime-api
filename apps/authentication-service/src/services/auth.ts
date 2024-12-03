import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { PrismaClient } from "../database/generated-prisma-client";
import { IAuthService } from "../interfaces/auth";
import { ApiError } from "@libs/shared";
import { generateToken, validateToken } from "../utils/token";
import {
    CreateUserRequest, EmailResetRequest,
    LoginUserRequest,
    RefreshTokenRequest, ResetPasswordRequest,
    TokenResponse,
    toUserResponse,
    UserResponse
} from "../models/auth";

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

    async signup(request: CreateUserRequest): Promise<UserResponse> {
        if (request.password !== request.confirm_password) {
            throw new ApiError(400, 'BAD_REQUEST', [{ message: 'Passwords do not match' }]);
        }

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: request.email },
                    { username: request.username },
                ]
            }
        });

        if(existingUser) {
            if (existingUser.email === request.email) {
                throw new ApiError(400, 'BAD_REQUEST', [{ message: 'Email is already taken' }]);
            }
            if (existingUser.username === request.username) {
                throw new ApiError(400, 'BAD_REQUEST', [{ message: 'Username is already taken' }]);
            }
        }

        const hashedPassword = await bcrypt.hash(request.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: request.email,
                username: request.username,
                password: hashedPassword
            }
        });

        return toUserResponse(newUser);
    }
    async login(request: LoginUserRequest): Promise<TokenResponse> {
        const user = await this.prisma.user.findUnique({
            where: { username: request.username },
        });

        if (!user || !(await bcrypt.compare(request.password, user.password))) {
            throw new ApiError(401, 'UNAUTHORIZED', [{ message: 'Invalid username or password' }]);
        }

        const accessToken = await generateToken(
            { "id": user.id, "username": user.username, "iss": this.JWT_KEY },
            this.JWT_SECRET, "1h"
        );

        const refreshToken = await generateToken(
            { 'id': user.id, 'username': user.username },
            this.REFRESH_JWT_SECRET, "7d"
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const accessTokenExpires = new Date();
        accessTokenExpires.setHours(accessTokenExpires.getHours() + 1);

        await this.prisma.token.create({
            data: {
                userId: user.id,
                refreshToken: refreshToken,
                expiresAt: expiresAt,
            }
        });

        return {
            access_token: accessToken,
            access_token_expires: accessTokenExpires,
            refresh_token: refreshToken,
        };
    }
    async refreshToken(request: RefreshTokenRequest): Promise<TokenResponse> {
        const storedToken = await this.prisma.token.findFirst({
            where: {
                refreshToken: request.refresh_token
            }
        });

        if (!storedToken) {
            throw new ApiError(404, 'NOT_FOUND', [{ message: 'Token not found' }]);
        }

        const { valid, decoded, error } = await validateToken(request.refresh_token, this.REFRESH_JWT_SECRET);

        if (!valid) {
            throw new ApiError(401, 'UNAUTHORIZED', [{ message: error || 'Invalid token' }]);
        }

        const userData = decoded;

        const newToken = await generateToken(
            { "id": userData.id, "username": userData.username, "iss": this.JWT_KEY },
            this.JWT_SECRET,
            "1h"
        );

        const accessTokenExpires = new Date();
        accessTokenExpires.setHours(accessTokenExpires.getHours() + 1);

        return {
            access_token: newToken,
            access_token_expires: accessTokenExpires,
        }
    }
    async logout(request: RefreshTokenRequest): Promise<void> {
        const refreshToken = await this.prisma.token.findFirst({
            where: {
                refreshToken: request.refresh_token
            }
        });
        if (!refreshToken) {
            throw new ApiError(404, 'NOT_FOUND', [{ message: 'Token Not Found' }]);
        }
        await this.prisma.token.delete({where: { refreshToken: request.refresh_token }});
    }
    async requestResetPassword(request: EmailResetRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async resetPassword(request: ResetPasswordRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }
}