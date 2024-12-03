import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth";
import { sendSuccessResponse } from "@libs/shared";
import {
    CreateUserRequest,
    EmailResetRequest,
    LoginUserRequest,
    RefreshTokenRequest,
    ResetPasswordRequest
} from "../models/auth";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await this.authService.signup(request);
            sendSuccessResponse(res, 201, 'USER_CREATED', response)
        } catch (error) {
            next(error);
        }
    }
    
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await this.authService.login(request);
            sendSuccessResponse(res, 200, 'OK', response)
        }  catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RefreshTokenRequest = req.body as RefreshTokenRequest;
            const data = await this.authService.refreshToken(request);
            sendSuccessResponse(res, 200, 'OK', data)
        }  catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RefreshTokenRequest = req.body as RefreshTokenRequest;
            await this.authService.logout(request);
            sendSuccessResponse(res, 200, 'OK', { message: "Successfully logged out" });
        } catch (error) {
            next(error);
        }
    }

    async requestResetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const request: EmailResetRequest = req.body as EmailResetRequest;
            await this.authService.requestResetPassword(request);
            sendSuccessResponse(res, 200, 'OK', { message: "Password reset email sent successfully." })
        }  catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const request: ResetPasswordRequest = req.body as ResetPasswordRequest;
            await this.authService.resetPassword(request);
            sendSuccessResponse(res, 200, 'OK', { message: "Password has been reset successfully." })
        }  catch (error) {
            next(error);
        }
    }

}
