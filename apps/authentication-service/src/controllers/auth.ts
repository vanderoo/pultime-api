import { Request, Response } from "express";
import { AuthService } from "../services/auth";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/api-error";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async signup(req: Request, res: Response) {
        try {
            const { email, username, password, confirmPassword } = req.body;
            const data = await this.authService.signup(email, username, password, confirmPassword);
            sendSuccessResponse(res, 201, 'USER_CREATED', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", [{ message: error.message }]);
            }
            sendErrorResponse(res, error);
        }
    }
    
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const data = await this.authService.login(username, password);
            sendSuccessResponse(res, 200, 'OK', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", [{ message: error.message }]);
            }
            sendErrorResponse(res, error);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            await this.authService.logout(refreshToken);
            sendSuccessResponse(res, 200, 'OK', {})
        }catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", [{ message: error.message }]);
            }
            sendErrorResponse(res, error);
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            const data = await this.authService.refreshToken(refreshToken);
            sendSuccessResponse(res, 200, 'OK', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", [{ message: error.message }]);
            }
            sendErrorResponse(res, error);
        }
    }
}