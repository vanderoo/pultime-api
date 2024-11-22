import { Request, Response } from "express";
import { UserService } from "../services/user";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/api-error";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async updateUsername(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const { username } = req.body;
            const data = await this.userService.updateUsername(userId, username);
            sendSuccessResponse(res, 200, 'USERNAME_UPDATED', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", { error: error.message });
            }
            sendErrorResponse(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const data = await this.userService.delete(userId);
            sendSuccessResponse(res, 200, 'USER_DELETED', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", { error: error.message });
            }
            sendErrorResponse(res, error);
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const data = await this.userService.findById(userId);
            sendSuccessResponse(res, 200, 'USER_RETRIEVED', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", { error: error.message });
            }
            sendErrorResponse(res, error);
        }
    }

    async listUserClasses(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const data = await this.userService.listUserClasses(userId);
            sendSuccessResponse(res, 200, 'USER_CLASSES_RETRIEVED', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", { error: error.message });
            }
            sendErrorResponse(res, error);
        }
    }

    async listUserTeam(req: Request, res: Response){
        try {
            const userId = req.params.id;
            const data = await this.userService.listUserTeams(userId);
            sendSuccessResponse(res, 200, 'USER_TEAMS_RETRIEVED', data)
        } catch (error) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(500, "INTERNAL_SERVER_ERROR", { error: error.message });
            }
            sendErrorResponse(res, error);
        }
    }
}