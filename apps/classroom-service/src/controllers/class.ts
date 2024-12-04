import { NextFunction, Request, Response } from "express";
import { ClassService } from "../services/class";
import { sendSuccessResponse } from "@libs/shared";
import { ClassAddUserRequest, ClassRequest, ClassUpdateRequest } from "../models/class";

export class ClassController {
    private classService: ClassService;

    constructor(classService: ClassService) {
        this.classService = classService;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as ClassRequest;
            const data = await this.classService.create(request);
            sendSuccessResponse(res, 200, 'CLASS_CREATED', data)
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as ClassUpdateRequest;
            request.id = req.params.id;
            const data = await this.classService.update(request);
            sendSuccessResponse(res, 200, 'CLASS_UPDATED', data);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.classService.delete(req.params.id);
            sendSuccessResponse(res, 200, 'CLASS_DELETED', data);
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.classService.findById(req.params.id);
            sendSuccessResponse(res, 200, 'CLASS_RETRIEVED', data);
        } catch (error) {
            next(error);
        }
    }

    async listUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.classService.listUsers(req.params.id);
            sendSuccessResponse(res, 200, 'CLASS_USERS_RETRIEVED', data);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.classService.deleteUser(req.params.id, req.params.user_id);
            sendSuccessResponse(res, 200, 'CLASS_USERS_DELETED', data);
        } catch (error) {
            next(error);
        }
    }

    async addUser(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as ClassAddUserRequest;
            request.class_code = req.params.class_code;
            const data = await this.classService.addUser(request);
            sendSuccessResponse(res, 200, 'CLASS_USERS_ADDED', data);
        } catch (error) {
            next(error);
        }
    }

}