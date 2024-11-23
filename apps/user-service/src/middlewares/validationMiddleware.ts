import { Request, Response, NextFunction } from "express";
import { updateUsernameValidator, userIdValidator } from "../validators/user";
import { ApiError } from "../utils/api-error";
import { sendErrorResponse } from "../utils/response";

export const validateUpdateUsername = (req: Request, res: Response, next: NextFunction) => {
    const result = updateUsernameValidator.safeParse({ id: req.params.id, ...req.body });
    if (!result.success) {
        const error = new ApiError(400, "INVALID_REQUEST_DATA", result.error.errors);
        sendErrorResponse(res, error);
        return;
    }
    next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
    const result = userIdValidator.safeParse({ id: req.params.id });
    if (!result.success) {
        const error = new ApiError(400, "INVALID_REQUEST_DATA", result.error.errors);
        sendErrorResponse(res, error);
        return;
    }
    next();
};
