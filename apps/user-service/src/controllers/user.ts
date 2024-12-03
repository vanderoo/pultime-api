import {NextFunction, Response} from "express";
import { UserService } from "../services/user";
import { sendSuccessResponse, UserRequest } from "@libs/shared";
import { UpdateUserRequest } from "../models/user";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async updateUsername(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as UpdateUserRequest;
            const data = await this.userService.updateUsername(req.user, request);
            sendSuccessResponse(res, 200, 'USERNAME_UPDATED', data)
        } catch (error) {
            next(error);
        }
    }

    async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const data = await this.userService.get(req.user);
            sendSuccessResponse(res, 200, 'USER_RETRIEVED', data)
        } catch (error) {
            next(error);
        }
    }

    async listUserClasses(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const data = await this.userService.listUserClasses(req.user);
            sendSuccessResponse(res, 200, 'USER_CLASSES_RETRIEVED', data)
        } catch (error) {
            next(error);
        }
    }

    async listUserTeam(req: UserRequest, res: Response, next: NextFunction){
        try {
            const data = await this.userService.listUserTeams(req.user);
            sendSuccessResponse(res, 200, 'USER_TEAMS_RETRIEVED', data)
        } catch (error) {
            next(error);
        }
    }
}