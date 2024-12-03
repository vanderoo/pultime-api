import {
    CreateUserRequest, EmailResetRequest,
    LoginUserRequest,
    RefreshTokenRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse
} from "../models/auth";

export interface IAuthService {
    signup(request: CreateUserRequest): Promise<UserResponse>;
    login(request: LoginUserRequest): Promise<TokenResponse>;
    refreshToken(request: RefreshTokenRequest): Promise<TokenResponse>;
    logout(request: RefreshTokenRequest): Promise<void>
    requestResetPassword(request: EmailResetRequest): Promise<void>;
    resetPassword(request: ResetPasswordRequest): Promise<void>;
}