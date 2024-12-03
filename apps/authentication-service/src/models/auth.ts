import { User } from "../database/generated-prisma-client";

export type UserResponse = {
    id: string;
    email: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}

export type CreateUserRequest = {
    email: string;
    username: string;
    password: string;
    confirm_password: string;
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

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type TokenResponse = {
    access_token: string;
    access_token_expires: Date;
    refresh_token?: string;
}

export type RefreshTokenRequest = {
    refresh_token: string;
}

export type EmailResetRequest = {
    email: string;
}

export type ResetPasswordRequest = {
    token: string;
    password: string;
    confirm_password: string;
}